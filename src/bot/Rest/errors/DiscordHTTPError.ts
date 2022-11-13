export class DiscordHTTPError extends Error {
	res: any;
	response: any;

	constructor(req: any, res: any, response: any, stack: any) {
		super();

		Object.defineProperty(this, 'req', {
			enumerable: false,
			value: req,
		});
		Object.defineProperty(this, 'res', {
			enumerable: false,
			value: res,
		});
		Object.defineProperty(this, 'response', {
			enumerable: false,
			value: response,
		});

		Object.defineProperty(this, 'code', {
			enumerable: false,
			value: res.statusCode,
		});
		let message = `${res.statusCode} ${res.statusMessage} on ${req.method} ${req.path}`;
		const errors = this.flattenErrors(response);
		if (errors.length > 0) {
			message += '\n  ' + errors.join('\n  ');
		}
		Object.defineProperty(this, 'message', {
			enumerable: false,
			value: message,
		});

		if (stack) {
			this.stack = this.name + ': ' + this.message + '\n' + stack;
		} else {
			Error.captureStackTrace(this, DiscordHTTPError);
		}
	}

	get headers() {
		return this.response.headers;
	}

	get name() {
		return this.constructor.name;
	}

	flattenErrors(errors: any, keyPrefix = '') {
		let messages: string[] = [];
		for (const fieldName in errors) {
			if (!errors.hasOwnProperty(fieldName) || fieldName === 'message' || fieldName === 'code') {
				continue;
			}
			if (Array.isArray(errors[fieldName])) {
				messages = messages.concat(errors[fieldName].map((str: string) => `${keyPrefix + fieldName}: ${str}`));
			}
		}
		return messages;
	}
}
