const api = require('./common/api');


module.exports = async function (activity) {
  try {
    api.initialize(activity);

    const response = await api('/expensereports?filter_by=Type.Approval%2CStatus.Submitted');

    // convert response to items[]
    activity.Response.Data = api.convertReports(response);

  } catch (error) {

    // return error response
    var m = error.message;
    if (error.stack) m = m + ": " + error.stack;

    activity.Response.ErrorCode = (error.response && error.response.statusCode) || 500;
    activity.Response.Data = { ErrorText: m };

  }

};



