Template.meteorAlerts.helpers({
  alerts: function() {
    return Alerts.collection.find({ template: 'window' });
  }
});

Template.meteorAlert.onRendered(function() {
  const alert = this.data;

  if (alert && alert.duration > 0) {
    Meteor.setTimeout(function () {
      Alerts.collection.remove(alert._id);
    }, alert.duration);
  }
});

const style = {
  error: {
    className: 'alert-danger',
    icon: 'fa-minus-circle'
  },
  info: {
    className: 'alert-info',
    icon: 'fa-exclamation-circle'
  },
  warning: {
    className: 'alert-warning',
    icon: 'fa-exclamation-triangle'
  },
  success: {
    className: 'alert-success',
    icon: 'fa-thumbs-o-up'
  }
};

Template.meteorAlert.helpers({
  alertClass: function() {
    return style[this.type].className;
  },
  alertIcon: function() {
    return style[this.type].icon;
  }
});

Template.meteorAlert.events({
  'click .close': function() {
    Alerts.collection.remove(this._id);
  }
});


Template.meteorModalAlerts.helpers({
  alerts: function() {
    return Alerts.collection.find({ template: 'modal' });
  }
});

Template.meteorModalAlerts.onRendered(function() {
  const alert = this.data;

  if (alert && alert.duration > 0) {
    Meteor.setTimeout(function () {
      Alerts.collection.remove(alert._id);
    }, alert.duration);
  }
});

