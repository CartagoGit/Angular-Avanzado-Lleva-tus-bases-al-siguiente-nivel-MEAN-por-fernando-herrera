import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { defaultErrorResponse } from '../helpers/default-responses';
import { ErrorData } from '../models/error-data.model';

export const validatorCheck = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const status_code = 406;

		const finalErrorData = new ErrorData({
			status_code,
			reason: 'validation',
			message:
				errors.array().length > 1
					? 'There are a lot of validation errors. Check them to fix the problems.'
					: errors.array()[0].msg,
			keyValue: errors.mapped(),
		});

		defaultErrorResponse(res, req, finalErrorData, 'MONGO', status_code);
		return;
	}
	next();
};