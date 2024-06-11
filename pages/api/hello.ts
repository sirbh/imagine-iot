import type { NextApiRequest, NextApiResponse } from 'next'
 

 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.query.q)
  res.status(200).json({ message: req.query.q})
}