Royo.controller('AgentSlotsCtrl', ['$scope', '$stateParams', 'services', 'factories', 'API',
  function ($scope, $stateParams, services, factories, API) {

    $scope.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    $scope.agent_token = '';
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var date = today.getDate();
    $scope.agentName = $stateParams.name;
    $scope.message = '';
    $scope.slotArr = [];
    $scope.selectedDate = '';
    $scope.multiple = false;
    $scope.selectedSlots = [];
    $scope.selectedDays = {};

    $scope.slotDuration = factories.getSettings().bookingFlow[0].interval;
    $scope.error = false;

    $scope.daysArr = [];
    var week = [' ', ' ', ' ', ' ', ' ', ' ', ' '];

    var getAgentToken = function () {
      let param_data = {};
      param_data.agentId = $stateParams.id;
      param_data.sectionId = 63;

      services.GET_DATA(param_data, API.GET_AGENT_TOKEN(), function (response) {
        $scope.agent_token = response.data;
        getAgentAvailability();
      });
    }
    getAgentToken();

    var getAgentAvailability = function () {
      let param_data = {};
      param_data.agent_token = $scope.agent_token;
      param_data.sectionId = 63;

      services.GET_DATA(param_data, API.GET_AGENT_AVAILABILITY(), function (response) {
        $scope.is_loader = 0;
        $scope.availability = response.data.length ? response.data[0] : null;
        slotData();
      });
    }

    $scope.refreshAva = function () {
      week = [' ', ' ', ' ', ' ', ' ', ' ', ' '];
      $scope.daysArr = [];
      getAgentAvailability();
    }

    var slotData = function () {
      for (let i = 0; i < 30; i++) {
        let day = new Date(year, month, date + i);
        if (day.getDay() < 6) {
          dayData(day);
          if (i === 29) {
            $scope.daysArr.push(week);
          }
        } else {
          dayData(day);
          $scope.daysArr.push(week);
          week = [' ', ' ', ' ', ' ', ' ', ' ', ' '];
        }
      }
    }

    var dayData = function (day) {
      week[day.getDay()] = {
        date: day,
        day: $scope.days[day.getDay()],
        slots: []
      };
      if ($scope.availability) {
        $scope.availability.cbl_user_times.forEach(time => {
          $scope.availability.cbl_user_avail_dates.forEach(date => {
            if (moment(date.from_date).format('YYYY-MM-DD') === moment(day).format('YYYY-MM-DD')) {
              if (date.id === time.date_id) {
                week[day.getDay()].slots.push(time);
              }
            }
          });
          if ((day.getDay() === time.day_id) && $scope.availability.cbl_user_availablities[day.getDay()].status) {
            week[day.getDay()].slots.push(time);
          }
        });
        week[day.getDay()].slots = _.uniq(week[day.getDay()].slots.slice(), false, slot => { return slot.start_time && slot.end_time });
      }
    }

    var setSlots = function () {
      $scope.slotArr = [];
      let day = 0;
      while (day <= 6) {
        $scope.formData.weeks_data.push({
          day_id: day,
          status: 0
        });
        day++;
      }

      if ($scope.availability) {
        $scope.availability.cbl_user_availablities.forEach(day => {
          // if (day.status) {
          //     $scope.selectedDays[day.day_id] = true;
          //     $scope.formData.weeks_data[day.day_id].status = 1;
          // }
          $scope.formData.weeks_data[day.day_id].id = day.id;
        });
      }

      if ($scope.selectedDate.slots.length) {
        $scope.selectedDate.slots.forEach(slot => {
          let start = new Date(moment($scope.selectedDate.date).format('YYYY-MM-DD') + ' ' + slot.start_time);
          let end = new Date(moment($scope.selectedDate.date).format('YYYY-MM-DD') + ' ' + slot.end_time);
          $scope.slotArr.push({
            start_time: new Date(start.getFullYear(), start.getMonth(), start.getMonth(), start.getHours(), start.getMinutes(), start.getSeconds()),
            end_time: new Date(end.getFullYear(), end.getMonth(), end.getMonth(), end.getHours(), end.getMinutes(), end.getSeconds()),
            id: slot.id,
          });
        });
      } else {
        $scope.slotArr = [{
          start_time: new Date(year, month, date, 00, 00, 0),
          end_time: new Date(year, month, date, 00, 00 + $scope.slotDuration, 0),
        }];
      }
    }

    $scope.bookSlot = function (slotData) {
      $scope.formData = {
        offset: moment().format('Z'),
        agent_token: $scope.agent_token,
        weeks_data: [],
        user_time: [],
        user_avail_date: [{
          from_date: '',
          to_date: '',
          status: ''
          // id: '0'
        }],
        sectionId: 63,
      };
      $scope.selectedDate = slotData;
      setSlots();
      $("#agent_slot").modal('show');
    };

    var checkSlots = function () {
      $scope.error = false;
      let i = 0;
      for (let slot of $scope.slotArr) {
        if (getTime(slot.start_time).isSame(getTime(slot.end_time), 'minutes')) {
          $scope.error = true;
          return;
        } else if (getTime(slot.start_time).isAfter(getTime(slot.end_time), 'minutes')) {
          $scope.error = true;
          return;
        } else if ((i + 1 < $scope.slotArr.length) && (getTime(slot.end_time).isAfter(getTime($scope.slotArr[i + 1].start_time), 'minutes'))) {
          $scope.error = true;
          return;
        } else {
          $scope.slotArr.forEach(s => {
            if (getTime(s.start_time).isAfter(getTime(slot.start_time)) && getTime(s.end_time).isBefore(getTime(slot.end_time))) {
              $scope.error = true;
              return;
            }
          });
        }
        i++;
      }
    }

    var getTime = function (dateTime) {
      dateTime = moment(dateTime);
      return moment({ h: dateTime.hours(), m: dateTime.minutes() });
    }

    $scope.addSlot = function (childIndex) {
      if ($scope.slotArr.length) {
        let previousTime = new Date($scope.slotArr[$scope.slotArr.length - 1].end_time);
        $scope.slotArr.push({
          start_time: new Date(year, month, date, previousTime.getHours(), previousTime.getMinutes(), previousTime.getSeconds()),
          end_time: new Date(year, month, date, previousTime.getHours(), previousTime.getMinutes() + $scope.slotDuration, previousTime.getSeconds()),
        });
      } else {
        $scope.slotArr = [{
          start_time: new Date(year, month, date, 00, 00, 0),
          end_time: new Date(year, month, date, 00, 00 + $scope.slotDuration, 0),
        }];
      }
    };

    $scope.deleteSlot = function (childIndex) {
      if (!!$scope.slotArr[childIndex].id) {
        let param_data = {};
        param_data.sectionId = 63;
        param_data.agent_token = $scope.agent_token;
        param_data.slotId = $scope.slotArr[childIndex].id;

        services.PUT_DATA(param_data, API.DELETE_AGENT_TIME_SLOT(), function (response) {
          $scope.slotArr.splice(childIndex, 1);
          $scope.error = $scope.slotArr.some(slot => {
            if ((slot.end_time < slot.start_time) || (($scope.slotArr.indexOf(slot) + 1 < $scope.slotArr.length) && slot.end_time > $scope.slotArr[$scope.slotArr.indexOf(slot) + 1].start_time)) {
              return true;
            } else return false;
          });
        });
      } else {
        $scope.slotArr.splice(childIndex, 1);
        $scope.error = $scope.slotArr.some(slot => {
          if ((slot.end_time < slot.start_time) || (($scope.slotArr.indexOf(slot) + 1 < $scope.slotArr.length) && slot.end_time > $scope.slotArr[$scope.slotArr.indexOf(slot) + 1].start_time)) {
            return true;
          } else return false;
        });
      }
    }

    $scope.applyCurrent = function () {
      checkSlots();
      $scope.is_days = false;
      $scope.formData.user_avail_date[0].from_date = moment($scope.selectedDate.date).format('YYYY-MM-DD');
      $scope.formData.user_avail_date[0].to_date = moment($scope.selectedDate.date).format('YYYY-MM-DD');
      $scope.formData.user_avail_date[0].status = '1';
      if ($scope.availability) {
        $scope.formData.weeks_data = [];
        $scope.availability.cbl_user_avail_dates.find(date => {
          if (date.from_date === $scope.formData.user_avail_date[0].from_date) {
            $scope.formData.user_avail_date[0].id = date.id;
          }
        });
      }
      setAvailability(false);
    }

    $scope.applyAll = function () {
      checkSlots();
      $scope.is_days = true;
      $scope.formData.user_avail_date = [];
      Object.keys($scope.selectedDays).forEach(day => {
        if ($scope.selectedDays[day]) {
          $scope.formData.weeks_data[day].status = 1;
        }
      });
      setAvailability(false);
    }

    $scope.applyToDay = function (day) {
      checkSlots();
      $scope.is_days = true;
      $scope.formData.user_avail_date = [];
      $scope.formData.weeks_data[$scope.days.indexOf(day)].status = 1
      setAvailability(true);
    }

    var setAvailability = function (repeating_day) {
      if ($scope.error) {
        factories.invalidDataPop("Slot Intervals are invalid, please reselect");
        return;
      }
      $scope.formData.user_time = [];
      $scope.slotArr.forEach(slot => {
        let obj = {
          start_time: moment(slot.start_time).format('HH:mm:ss'),
          end_time: moment(slot.end_time).format('HH:mm:ss'),
        }
        if (slot['id'] && !repeating_day) {
          obj['id'] = slot['id'];
        }

        $scope.formData.user_time.push(obj);
      });

      if ($scope.is_days) {
        let arr = [];
        $scope.formData.weeks_data.forEach(day => {
          if (day['status']) {
            $scope.formData.user_time.forEach(slot => {
              let s = { ...slot };
              s['day_id'] = day['day_id']
              arr.push(s);
            });
          }
          if ($scope.availability && $scope.availability.cbl_user_availablities[day['day_id']].status) {
            day['status'] = 1
          }
        });
        $scope.formData.user_time = arr;
      }

      if ($scope.availability) {
        services.POST_DATA($scope.formData, API.UPDATE_AGENT_AVAILABILITY(), function (response) {
          afterAvaSet();
        });
      } else {
        services.POST_DATA($scope.formData, API.SET_AGENT_AVAILABILITY(), function (response) {
          afterAvaSet();
        });
      }
    }

    var afterAvaSet = function () {
      $scope.refreshAva();
      $scope.message = `Availability has been ${$scope.availability ? 'updated' : 'added'}`;
      $("#agent_slot").modal('hide');
      services.SUCCESS_MODAL(true);
    }

    $scope.switch = function () {
      $scope.multiple = !$scope.multiple;
    }

  }]);
