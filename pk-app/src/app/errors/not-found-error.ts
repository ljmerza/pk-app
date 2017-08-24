import { AppError } from './app-error';

export class NotFoundError extends AppError {
	
	constructor(public orignalError:any){
		super(orignalError);
	}
}