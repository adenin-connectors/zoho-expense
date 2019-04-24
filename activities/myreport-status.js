'use strict';
const api = require('./common/api');

module.exports = async (activity) => {
  try {
    api.initialize(activity);
    const response = await api('/expensereports?filter_by=Type.Approval%2CStatus.Submitted');

    if ($.isErrorResponse(activity, response)) return;

    let reportStatus = {
      title: T(activity, 'Reports Pending Approval'),
      link: 'https://expense.zoho.com/app#/expenses',
      linkLabel: T(activity, 'All Reports')
    };

    let noOfReports = response.body.expense_reports.length;

    if (noOfReports != 0) {
      reportStatus = {
        ...reportStatus,
        description: noOfReports > 1 ?
          T(activity, "You have {0} expense reports  waiting for approval.", noOfReports)
          : T(activity, "You have 1 expense report waiting for approval."),
        color: 'blue',
        value: noOfReports,
        actionable: true
      };
    } else {
      reportStatus = {
        ...reportStatus,
        description: T(activity, `You have no unapproved expense reports.`),
        actionable: false
      };
    }

    activity.Response.Data = reportStatus;
  } catch (error) {
    $.handleError(activity, error);
  }
};
