enum ErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NO_PERMISSION = 403,
  SERVER_ERROR = 500,
}

export const SUCCESS = { code: 0, message: '请求成功' };
export const okData = (data: any) => ({
  code: 0,
  message: '操作成功',
  data,
});
export const BAD_REQUEST = {
  code: ErrorCode.BAD_REQUEST,
  message: '请求错误',
};
export const SERVER_ERROR = {
  code: ErrorCode.SERVER_ERROR,
  message: '服务器异常',
};
export const UNAUTHORIZED = {
  code: ErrorCode.UNAUTHORIZED,
  message: '请先登录',
};
export const NO_PERMISSION = {
  code: ErrorCode.NO_PERMISSION,
  message: '没有权限',
};
