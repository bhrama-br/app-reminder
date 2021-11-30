document.addEventListener("turbolinks:load", () => {

  var calendar = new Calendar('#calendar', {
    defaultView: 'month',
    taskView: true,
    useCreationPopup: false,
    useDetailPopup: false,
    template: {
      milestone: function(model) {
        '<span style="background: ' + schedule.color + ' !important;color:#fff; padding: 1px;"><i class="fa fa-flag"></i> ' + schedule.title + '</span>';
      },
      allday: function(schedule) {
        return '<span style="background: ' + schedule.color + ' !important;color:#fff; padding: 1px;"><i class="fa fa-flag"></i> ' + schedule.title + '</span>';
      },
      time: function (schedule) {
        return '<span style="background: ' + schedule.color + ' !important;color:#fff; padding: 1px;"><i class="fa fa-flag"></i> ' + schedule.title + '</span>';
      }
    }
  });

  //CLICK date to create schedule
  calendar.on('beforeCreateSchedule', function (event) {
    $("#startDate").val(moment(event.start._date).format('YYYY-MM-DDTH:mm'))
    $("#endDate").val(moment(event.end._date).format('YYYY-MM-DDTH:mm'))
    $("#btn-modal").click();
    event.guide.clearGuideElement();
  });

  //Edit Schedule
  calendar.on('clickSchedule', function(event) {
    resetErrors();

    $("#modalUpdateReminder #startDate").val(moment(event.schedule.start._date).format('YYYY-MM-DDTH:mm'))
    $("#modalUpdateReminder #endDate").val(moment(event.schedule.end._date).format('YYYY-MM-DDTH:mm'))
    $("#modalUpdateReminder #text").val(event.schedule.title)
    $("#modalUpdateReminder #color").val(event.schedule.bgColor)
    $("#modalUpdateReminder #id").val(event.schedule.id)

    $('#openUpdateModal').click();
  });

  //Show or Hide loading
  window.loading = function (status) {
    if(status == 1){
      $('#loading').addClass('show');
    }else{
      $('#loading').removeClass('show');
    }
  }
  //Action Calendar Next, Prev and today.
  window.actionCalendar = function (v) {
    if (v == 'next') {
      calendar.next();
    } else if (v == 'prev') {
      calendar.prev();
    } else {
      calendar.today();
    }
  }

  //Cancel modal = Clear Form.
  window.cancelModal = function () {
    $("#text").val('');
    $("#startDate").val('');
    $("#endDate").val('');
    $("#color").val('');
  }

  //Cancel modal = Clear Form.
  window.cancelUpdateModal = function () {
    $("#modalUpdateReminder #text").val('');
    $("#modalUpdateReminder #startDate").val('');
    $("#modalUpdateReminder #endDate").val('');
    $("#modalUpdateReminder #color").val('');
    $("#modalUpdateReminder #id").val('');
  }

  //Cancel modal = Clear Form.
  window.resetErrors = function () {
    $(".errors-request").html('');
  }

  window.getReminder = function () {
    loading(1)
    $.ajax({
      method: "GET",
      url: '/api/reminder'
    })
      .done(function (response) {
        let dados = []
        response.data.forEach(el => {
          dados.push({
            id: el.id,
            calendarId: '1',
            color: el.color,
            bgColor: el.color,
            useOnlyScheduleColor: true,
            category: 'time',
            title: el.text,
            start: el.startDate,
            end: el.endDate
          })
        })

        calendar.createSchedules(
          dados
        );

        loading(0)
      })
  }

  //Create Reminder
  window.createReminder = function () {
    loading(1)

    resetErrors();

    var text = $("#text").val();
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var color = $("#color").val();
    let body = {
      reminder: {
        text: text,
        startDate: startDate,
        endDate: endDate,
        color: color,
      }
    }
    $.ajax({
      method: "post",
      url: '/api/reminder',
      data: body,
      beforeSend: function (jqXHR, settings) {
        jqXHR.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      },
      success: function (data, text) {
        calendar.createSchedules([
          {
            id: data.success.id,
            calendarId: '1',
            color: data.success.color,
            bgColor: data.success.color,
            useOnlyScheduleColor: true,
            category: 'time',
            title: data.success.text,
            start: data.success.startDate,
            end: data.success.endDate
          }]
        );
        $(".closeModalPost").click();
        cancelModal();
      },
      error: function (request, status, error) {
        if(JSON.parse(request.responseText).error.color){
          JSON.parse(request.responseText).error.color.forEach(errColor => {
            $(".errors-request").append('<p class="alert alert-danger">Error Color: '+ errColor +'</p>')
          });
        }
        if(JSON.parse(request.responseText).error.text){
          JSON.parse(request.responseText).error.text.forEach(errText => {
            $(".errors-request").append('<p class="alert alert-danger">Error Reminder: '+ errText +'</p>')
          });
        }
        if(JSON.parse(request.responseText).error.startDate){
          JSON.parse(request.responseText).error.startDate.forEach(errStartDate => {
            $(".errors-request").append('<p class="alert alert-danger">Error StartDate: '+ errStartDate +'</p>')
          });
        }
        if(JSON.parse(request.responseText).error.endDate){
          JSON.parse(request.responseText).error.endDate.forEach(errEndDate => {
            $(".errors-request").append('<p class="alert alert-danger">Error EndDate: '+ errEndDate +'</p>')
          });
        }
        console.log('error :>> ', JSON.parse(request.responseText).error);
      }
    })
    loading(0)

  }

  //Update Reminder
  window.updateReminder = function () {
    loading(1)

    resetErrors();

    var text = $("#modalUpdateReminder #text").val();
    var startDate = $("#modalUpdateReminder #startDate").val();
    var endDate = $("#modalUpdateReminder #endDate").val();
    var color = $("#modalUpdateReminder #color").val();
    var id = $("#modalUpdateReminder #id").val();
    let body = {
      reminder: {
        text: text,
        startDate: startDate,
        endDate: endDate,
        color: color,
      }
    }
    $.ajax({
      method: "PUT",
      url: '/api/reminder/'+ id,
      data: body,
      beforeSend: function (jqXHR, settings) {
        jqXHR.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      },
      success: function (data, text) {
        location.reload();
      },
      error: function (request, status, error) {
        if(JSON.parse(request.responseText).error.color){
          JSON.parse(request.responseText).error.color.forEach(errColor => {
            $(".errors-request").append('<p class="alert alert-danger">Error Color: '+ errColor +'</p>')
          });
        }
        if(JSON.parse(request.responseText).error.text){
          JSON.parse(request.responseText).error.text.forEach(errText => {
            $(".errors-request").append('<p class="alert alert-danger">Error Reminder: '+ errText +'</p>')
          });
        }
        if(JSON.parse(request.responseText).error.startDate){
          JSON.parse(request.responseText).error.startDate.forEach(errStartDate => {
            $(".errors-request").append('<p class="alert alert-danger">Error StartDate: '+ errStartDate +'</p>')
          });
        }
        if(JSON.parse(request.responseText).error.endDate){
          JSON.parse(request.responseText).error.endDate.forEach(errEndDate => {
            $(".errors-request").append('<p class="alert alert-danger">Error EndDate: '+ errEndDate +'</p>')
          });
        }
        console.log('error :>> ', JSON.parse(request.responseText).error);
      }
    })
    loading(0)

  }
//Update Reminder
  window.deleteUpdateModal = function () {
    loading(1)

    resetErrors();

    var id = $("#modalUpdateReminder #id").val();
    
    $.ajax({
      method: "DELETE",
      url: '/api/reminder/'+ id,
      beforeSend: function (jqXHR, settings) {
        jqXHR.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      },
      success: function (data, text) {
        location.reload();
      },
      error: function (request, status, error) {
        if(JSON.parse(request.responseText).error.color){
          JSON.parse(request.responseText).error.color.forEach(errColor => {
            $(".errors-request").append('<p class="alert alert-danger">Error Color: '+ errColor +'</p>')
          });
        }
        if(JSON.parse(request.responseText).error.text){
          JSON.parse(request.responseText).error.text.forEach(errText => {
            $(".errors-request").append('<p class="alert alert-danger">Error Reminder: '+ errText +'</p>')
          });
        }
        if(JSON.parse(request.responseText).error.startDate){
          JSON.parse(request.responseText).error.startDate.forEach(errStartDate => {
            $(".errors-request").append('<p class="alert alert-danger">Error StartDate: '+ errStartDate +'</p>')
          });
        }
        if(JSON.parse(request.responseText).error.endDate){
          JSON.parse(request.responseText).error.endDate.forEach(errEndDate => {
            $(".errors-request").append('<p class="alert alert-danger">Error EndDate: '+ errEndDate +'</p>')
          });
        }
        console.log('error :>> ', JSON.parse(request.responseText).error);
      }
    })
    loading(0)

  }
  
});