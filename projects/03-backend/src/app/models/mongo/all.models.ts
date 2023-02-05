import { Model } from 'mongoose';
import { UserModel } from './user.model';

/**
 * ? Objeto con la recopilacion de modelos de la api
 * @type {Record<string, Model<any>>}
 */
export const ApiModels: Record<string, Model<any>> = {
	Users: UserModel,
};
