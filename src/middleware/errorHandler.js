
export const errorHandler = (err, req, res, next) => {
  if(req.log){
      req.log.error(err);
  } else {
    console.error(err);
  }
  res.status(500).json({
    message: 'Internal Server Error'
  });
};
