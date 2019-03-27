'use strict';
const api = require('./common/api');

module.exports = async (activity) => {
  try {
    const response = await api('/expensereports?filter_by=Type.Approval%2CStatus.Submitted');

    if (Activity.isErrorResponse(response)) return;

    let reportStatus = {
      title: T('Reports Pending Approval'),
      link: 'https://expense.zoho.com/app#/expenses',
      linkLabel: T('All Reports')
    };

    let noOfReports = response.body.expense_reports.length;

    if (noOfReports != 0) {
      reportStatus = {
        ...reportStatus,
        description: noOfReports > 1 ?
          T("You have {0} expense reports  waiting for approval.", noOfReports)
          : T("You have 1 expense report waiting for approval."),
        color: 'blue',
        value: noOfReports,
        actionable: true
      };
    } else {
      reportStatus = {
        ...reportStatus,
        description: T(`You have no unapproved expense reports.`),
        actionable: false
      };
    }

    activity.Response.Data = reportStatus;
  } catch (error) {
    Activity.handleError(error);
  }
};
