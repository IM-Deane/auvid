import formidable from "formidable";

const form = formidable({ multiples: true }); // req.files will be an array

/**
 * @summary Parses multipart form data and sets the body and files fields in the request object
 * @param req request object
 * @param res response object
 * @param next calls the next middleware/route
 */
export default async function parseMultipartForm(req, res, next) {
	const contentType = req.headers["content-type"];

	if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
		form.parse(req, (err, fields, files) => {
			if (err) {
				next(err);
				return;
			}
			req.body = fields; // sets body field in request object
			req.files = files; // sets files field in request object
			next(); // continues to the next middleware/route
		});
	}
}
