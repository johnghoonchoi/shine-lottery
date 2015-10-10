momentFormat = function(time, format) {
  return (time) ? moment(time).format(format) : "";
};

if (Meteor.isClient)
  Template.registerHelper('momentFormat', momentFormat);

momentFromNow = function(time) {
  return moment(time).fromNow();
};

if (Meteor.isClient)
  Template.registerHelper('momentFromNow', momentFromNow);

momentKoreanDate = function (time, type) {
  var toObject = moment(time).toObject();

  // type
  // 1, default : 2015년 5월 13일 14시 30분 20초 (full date)
  // 2 : 2015년 5월 13일 14시 30분
  // 3 : 2015년 5월 13일 14시
  // 4 : 2015년 5월 13일 오후 2시 30분 20초
  // 5 : 2015년 5월 13일 오후 2시 30분
  // 6 : 2015년 5월 13일 오후 2시

  var years = toObject.years + "년 "; var months = toObject.months + "월 "; var days = toObject.date + "일 ";
  var hours = toObject.hours + "시 "; var minutes = toObject.minutes + "분 "; var seconds = toObject.seconds + "초 ";

  var date = years + months + days;

  var moments = "오전 ";
  if (toObject.hours >= 12) {
    moments = "오후 ";
  }

  switch (type) {
    case 2:
      return date + hours + minutes;
      break;
    case 3:
      return date + hours;
      break;
    case 4:
      return date + moments + hours + minutes + seconds;
      break;
    case 5:
      return date + moments + hours + minutes;
      break;
    case 6:
      break;
      return date + moments + hours;
    default:
      return date + hours + minutes + seconds;
      break;
  }
};

if (Meteor.isClient)
  Template.registerHelper('momentKoreanDate', momentKoreanDate);
