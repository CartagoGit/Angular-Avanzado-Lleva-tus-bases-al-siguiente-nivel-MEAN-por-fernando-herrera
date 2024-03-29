import { Request } from 'express';
import { Model, Document, Types } from 'mongoose';
import { ApiModels } from '../models/mongo.models';
import { getCapitalize } from './logs.helper';

/**
 * ? Crea y recupera un nuevo modelo de Mongo segun la URL
 * @param {Request} req
 * @returns {*}
 */
export const getNewModelSection = (
	req: Request
): Document<unknown, any, unknown> & {
	_id: Types.ObjectId;
} => {
	return new (getModelSection(req))(req.body);
};

/**
 * ? Recupera el modelo segun la url de la peticion
 * @param {Request} req
 * @returns {Model<unknown>}
 */
export const getModelSection = (req: Request): Model<unknown> => {
	return ApiModels[getCapitalize(getSectionFromUrl(req))];
};

/**
 * ? Recupera la seccion segun la url de la peticion
 * @param {Request} req
 * @returns {string}
 */
export const getSectionFromUrl = (req: Request): string => {
	const baseUrlSections = req.baseUrl.split('/');
	return baseUrlSections[baseUrlSections.length - 1];
};

/**
 * ? Recupera el metodo a usar segun la url de la peticion
 * @param {Request} req
 * @returns {endpoint : string, query: object | undefined}
 */
export const getMethodFromUrl = (
	req: Request
): { endpoint: string; query: object | undefined } => {
	const finalUrl = req.originalUrl
		.replace(req.baseUrl + '/', '')
		.split('/')[0];
	const [endpoint] = finalUrl.split('?');
	const query = Object.keys(req.query).length > 0 ? req.query : undefined;
	return { endpoint, query };
};

/**
 * ? Devuelve el mensaje de dato no encontrado en la seccion correspondiente, y con la id en caso de requerirla la request
 * @param {Request} req
 * @returns {string}
 */
export const getNotFoundMessage = (req: Request): string => {
	const { id = undefined } = req.params;
	const nameModel = getSectionFromUrl(req);
	return getNotFoundMessageWithIdAndModel(id, nameModel);
};

/**
 * ? Devuelve el mensaje de "not found" data en el modelo respecto a su id
 * @param {(string | undefined)} id
 * @param {string} nameModel
 * @returns {string}
 */
export const getNotFoundMessageWithIdAndModel = (
	id: string | undefined,
	nameModel: string
): string => {
	return `[ NOT FOUND ] There are not data in '${nameModel}'${
		id ? " with id '" + id + "'" : ''
	}`;
};
