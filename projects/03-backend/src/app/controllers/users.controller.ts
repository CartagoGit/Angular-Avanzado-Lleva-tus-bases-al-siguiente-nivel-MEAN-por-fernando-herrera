import { Request } from 'express';
import { UserModel } from '../models/mongo-models/user.model';
import { removeParamAndSetInfo } from '../helpers/default-responses.helper';
import {
	cleanValidatorField,
	checkIdInParams,
} from '../helpers/validator.helper';
import { getNotFoundMessage } from '../helpers/get-model-section.helper';
import { getEncryptHash } from '../helpers/encrypt.helper';
import { Role } from '../interfaces/roles.interface';
import { getPayloadFromJwtWithoutVerifiy } from '../helpers/json-web-token.helper';
import { basicError } from '../models/error-data.model';
import { DoctorModel } from '../models/mongo-models/doctors.model';
import { HospitalSchema } from '../models/mongo-models/hospital.model';

/**
 * ? Controladores especificos de los metodos para el modelo de usuarios
 * @type {{
	get: (req: Request) => Promise<any>;
	post: (req: Request) => Promise<any>;
	put: (req: Request) => Promise<any>;
	isDoctor: (req: Request) => Promise<any>;
	getDoctors: (req: Request) => Promise<any>;
	getHospitals: (req: Request) => Promise<any>;
}}
 */
export const usersController: {
	getByQuery: (req: Request) => Promise<any>;
	post: (req: Request) => Promise<any>;
	put: (req: Request) => Promise<any>;
	isDoctor: (req: Request) => Promise<any>;
	getDoctors: (req: Request) => Promise<any>;
	getHospitals: (req: Request) => Promise<any>;
} = {
	getByQuery: async (req) => {
		//TODO añadir parametro para buscar los que solo sean doctores, o los que no lo sean si da por hacer todo correcto. Lo dejamos asi ya que las bases ya se han aprendido a lo largo del curso y las pruebas y seria complicarse en exceso para la finalidad del proyecto

		return req.body;
	},
	post: async (req) => {
		//* Encriptamos la contraseña
		const { password } = req.body;
		req.body.password = getEncryptHash(password);
		req.body.role = 'USER_ROLE' as Role;
		// req.body.role = "ADMIN_ROLE" as Role;

		return req.body;
	},
	put: async (req) => {
		//* Condicionamos las respuestas a sus validadores y eliminamos las que no deban modificarse
		const userDB = await UserModel.findById(req.params['id']);
		if (!userDB)
			throw {
				message: getNotFoundMessage(req),
				status_code: 404,
				reason: 'not found id in model',
			} as basicError;
		const { id: idModifier } = getPayloadFromJwtWithoutVerifiy(req);
		const userModifierDB = (await UserModel.findById(idModifier))!;
		req.body['model'] = userDB;

		if (!!userDB.google) {
			const message =
				'Just the role of a google user can be modified, and only an administrator can do it';
			if (req.body.role && (userModifierDB.role as Role) === 'ADMIN_ROLE') {
				req.body.info = `${message}. Other fields are not modified`;
				return req.body;
			}
			throw {
				message,
				status_code: 409,
				reason: 'cannot google user',
			} as basicError;
		}

		if (userDB.email === req.body.email) {
			cleanValidatorField(req, 'email');
			delete req.body.email;
		}
		if (!!req.body.password)
			req.body.password = getEncryptHash(req.body.password);

		if (req.body.role && (userModifierDB.role as Role) !== 'ADMIN_ROLE') {
			removeParamAndSetInfo(req, 'role');
			req.body.info.role += ' if you have not ADMIN_ROLE';
		}
		if (req.body.google) removeParamAndSetInfo(req, 'google');

		return req.body;
	},

	//* Especificos de esta BD de usuarios
	isDoctor: async (req) => {
		checkIdInParams(req);
		const doctorBD = await DoctorModel.find({ user: req.params['id'] });
		const isDoctor =
			!!doctorBD && Array.isArray(doctorBD) && doctorBD.length !== 0;
		return { data: { is_doctor: isDoctor }, status_code: 200 };
	},
	getDoctors: async (req) => {
		const doctorsBD = await DoctorModel.find({ patients: req.params['id'] });
		return { data: doctorsBD, status_code: 200 };
	},
	getHospitals: async (req) => {
		const doctorsBD = await DoctorModel.find({
			patients: req.params['id'],
		});
		const hospitalsFromUser: (typeof HospitalSchema.obj)[] = [];
		for (let doctor of doctorsBD) {
			for (let hospital of doctor.hospitals) {
				const isHospitalAdded = hospitalsFromUser.some(
					(hospitalFromUser) => hospitalFromUser.id === hospital.id
				);
				if (!isHospitalAdded) hospitalsFromUser.push(hospital);
			}
		}
		return { data: hospitalsFromUser, status_code: 200 };
	},
};
