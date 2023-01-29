import mongoose from 'mongoose';
import { config } from '../../environments/config';
import { from, Observable, switchMap, tap } from 'rxjs';
import { logError, log } from '../helpers/logs.helper';
import { getCapitalize } from '../helpers/get-capitalize.helper';

export const initMongo = () => {
	mongoose.set('strictQuery', false);

	getObservableMongoose()
		.pipe(
			tap(() => log(config.MONGO_URL_DB, 'MONGO', 'URL')),
			switchMap((_resp) => {
				mongoState.isMongoConnected = true;
				log('Connected succesfully', 'MONGO');
				return getObservableMongooseChange();
			})
		)
		.subscribe({
			next: (resp) => {
				log(
					getCapitalize(resp.operationType),
					'MONGO',
					'Something changed in MongoDB'
				);
				// console.log((resp as any).fullDocument);
			},
			error: (error) => {
				logError(error, 'MONGO', 'Mongo connection');
				mongoState.isMongoConnected = false;
			},
		});
};

export const getObservableMongoose = (): Observable<typeof mongoose> => {
	return from(mongoose.connect(config.MONGO_URL_DB, config.MONGO_OPTIONS));
};

export const getObservableMongooseChange = () => {
	return from(mongoose.connection.db.watch());
};

export const mongoState = {
	isMongoConnected: false,
	getState: function () {
		return !!this.isMongoConnected ? 'Connected' : 'Disconnected';
	},
};