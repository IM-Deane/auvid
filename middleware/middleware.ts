import { NextApiRequest, NextApiResponse } from "next";

import nextConnect from "next-connect";
import multipartFormParser from "../utils/multipart-form-parser";

const middleware = nextConnect();

middleware.use(multipartFormParser);

export default middleware;
