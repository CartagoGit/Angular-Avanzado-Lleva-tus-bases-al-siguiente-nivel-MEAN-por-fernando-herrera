import { Model, model, Schema } from 'mongoose';
import { Role } from '../../interfaces/roles.interface';
import { BaseModel } from './base.model';

/**
 * ? Crea el esquema del modelo de Usuarios en MongoDb
 * @type {Schema}
 */
export const UserSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		images: [
			{
				type: String,
			},
		],
		role: {
			type: String,
			required: true,
			default: 'USER_ROLE' as Role,
		},
		google: {
			type: Boolean,
			default: false,
		},
	},
	// { timestamps: true } //* Añade createdAt y updatedAt
);

// /**
//  * ? Reasigna los parametros a mostrar en las respuestas del modelo (no modifica los datos de la base de datos, solo la respuesta)
//  */
// UserSchema.method('toJSON', function () {
// 	const { __v, _id, password, ...rest } = this.toObject();
// 	return { ...rest, id: _id };
// });

/**
 * ? Exporta el modelo de Mongoose
 * @type {Model<any>}
 */

export const UserModel: Model<any> = model(
	'User',
	new Schema(Object.assign({}, BaseModel.schema.obj, UserSchema.obj), {
		timestamps: true,
	})
);
