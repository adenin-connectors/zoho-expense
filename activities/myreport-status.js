'use strict';

const logger = require('@adenin/cf-logger');
const handleError = require('@adenin/cf-activity').handleError;
const api = require('./common/api');

module.exports = async (activity) => {
  try {
    api.initialize(activity);
    const response = await api('/expensereports?filter_by=Type.Approval%2CStatus.Submitted');

    let reportStatus = {
      title: 'Reports Pending Approval',
      url: 'https://expense.zoho.com/app#/expenses',
      urlLabel: 'All Pending Reports',
    };

    let noOfReports = response.body.expense_reports.length;

    if (noOfReports != 0) {
      reportStatus = {
        ...reportStatus,
        description: `You have ${noOfReports} expense reports waiting for approval.`,
        color: 'blue',
        value: noOfReports,
        actionable: true
      }
    } else {
      reportStatus = {
        ...reportStatus,
        description: `You have no unapproved expense reports`,
        actionable: false
      }
    }

    activity.Response.Data = reportStatus;

  } catch (error) {
    handleError(error, activity);
  }
};
