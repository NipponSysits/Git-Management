import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Chart from 'chart.js';


require('/imports/language')('Dashboard');

import './dashboard.html';

Template.Dashboard.onRendered(() => {
  $('.ui.dimmer.prepare').fadeOut(300);
  $('.ui.panel.sign-in').hide();
  $('.ui.panel.main').show();
  
  $('.user-menu > .item').removeClass('selected');
  $('.user-menu > .item.home').addClass('selected');

  var ctx = $("#myChart");

var data = {
    labels: ["สาย", "ลาป่วย/มีใบรับรอง", "ลากิจ", "ขาดงาน", "ล่ป่วย/ไม่มีใบรับรอง", "ลาพักร้อน"],
    datasets: [
        {
            label: "",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: [65, 59, 90, 0, 56, 80]
        }
    ]
};

var myRadarChart = new Chart(ctx, {
    type: 'radar',
    data: data
});

});