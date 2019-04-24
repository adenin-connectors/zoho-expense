'use strict';
const api = require('./common/api');

module.exports = async function (activity) {
  try {
    api.initialize(activity);
    var pagination = $.pagination(activity);
    const response = await api(`/expensereports?filter_by=Type.Approval%2CStatus.Submitted` +
      `&page=${pagination.page}&per_page=${pagination.pageSize}`);

    if ($.isErrorResponse(activity, response)) return;

    activity.Response.Data = convertReports(response);
  } catch (error) {
    $.handleError(activity, error);
  }
};

//**maps response data to items */
function convertReports(response) {
  let items = [];
  let reports = response.body.expense_reports;

  for (let i = 0; i < reports.length; i++) {
    let raw = reports[i];
    let item = {
      id: raw.report_id,
      title: raw.report_name,
      description: raw.description,
      link: `https://expense.zoho.com/app#/expensereports/${raw.report_id}`,
      raw: raw
    };
    items.push(item);
  }

  return { items: items };
}


