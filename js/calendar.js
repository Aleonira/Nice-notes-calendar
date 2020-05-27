let calendarBlock=document.getElementById('calendar_section');

let calendar = {
    monthName:    ['Січень', 'Лютия', 'Березень', 'Квітень',
                    'Травень', 'Червень', 'Липень', 'Серпень',
                    'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
    dayName:      ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'],
    //вибрана дата
    selectedDate: {
                'Day': null,
                'Month': null,
                'Year': null
    },
    element_id: null,

    //вибираємо датуa
    selectDate: function (day, month, year) {
        this.selectedDate = {
            'Day': day,
            'Month': month,
            'Year': year
        };
        drawCalendar(month, year);
    }
};


function drawCalendar (month,year) {
        let calendarItemHtml='';
        calendarItemHtml+='<table class="calendar">';
        //навігація
        calendarItemHtml+='<tr>';
        calendarItemHtml+='<td class="navigation left-arrow" '+ 'onclick="drawCalendar('+(month>1?(month-1):12)+ ','+(month>1?year:(year-1))+');"><\/td>';
        calendarItemHtml+='<td class="navigation nav-month" colspan="3">';
        calendarItemHtml+='<span onclick="openSelectMonth('+year+');">'+ calendar.monthName[(month-1)]+'</span>';
        calendarItemHtml+='<\/td>';
        calendarItemHtml+='<td class="navigation nav-year" colspan="2">';
        calendarItemHtml+='<span onclick="openSelectYear('+year+','+month+');">'+year+'</span>';
        calendarItemHtml+='<\/td>';
        calendarItemHtml+='<td class="navigation right-arrow" '+ 'onclick="drawCalendar('+(month<12?(month+1):1)+ ','+(month<12?year:(year+1))+');"><\/td>';
        calendarItemHtml+='<\/tr>';
        //дні неділі
        calendarItemHtml+='<tr>';
        calendarItemHtml+='<th>'+calendar.dayName[0]+'<\/th>';
        calendarItemHtml+='<th>'+calendar.dayName[1]+'<\/th>';
        calendarItemHtml+='<th>'+calendar.dayName[2]+'<\/th>';
        calendarItemHtml+='<th>'+calendar.dayName[3]+'<\/th>';
        calendarItemHtml+='<th>'+calendar.dayName[4]+'<\/th>';
        calendarItemHtml+='<th class="holiday">'+calendar.dayName[5]+'<\/th>';
        calendarItemHtml+='<th class="holiday">'+calendar.dayName[6]+'<\/th>';
        calendarItemHtml+='<\/tr>';

        // Кількість днів в місяці
        let total_days = 32 - new Date(year, (month-1), 32).getDate();
        // Перший день місяця
        let start_day = new Date(year, (month-1), 1).getDay();
        if (start_day==0) {
            start_day=7;
        }
        start_day--;
        // Кількість квадратиків в календарі
        let final_index=Math.ceil((total_days+start_day)/7)*7;

        let day=1;
        let index=0;
        do {
            //  Початок рядка в календарі
            if (index%7==0) {
                calendarItemHtml+='<tr>';
            }
            // Пустые ячейки до початку і після кінця місяця
            if ((index<start_day) || (index>=(total_days+start_day))) {
                calendarItemHtml+='<td class="grayed">&nbsp;<\/td>';
            }
            else {
                let class_name='';
                // Вибраний день
                if (calendar.selectedDate.Day==day &&
                    calendar.selectedDate.Month==month &&
                    calendar.selectedDate.Year==year) {
                    class_name='selected';
                }
                else if ((makeEaste(year).getDate()==day) &&
                    (parseInt(makeEaste(year).getMonth())+1==month) &&
                    (makeEaste(year).getFullYear()==year)) {
                    class_name='holiday celebration';
                }
                // Вихідні
                else if (( (day == 1 || day == 7)  && month == 1 ) || ( day == 8 && month == 3)
                    || ( day == 8 && month == 3) || ((day == 1 || day == 9) && month == 5)
                    || ((day == 7 || day == 28) && month == 6) || ( day == 24 && month == 8)
                    || ( day == 14 && month == 10) || ( day == 25 && month == 12))  {
                        class_name='holiday celebration';
                }

                else if (new Date().getDate()==day &&
                    parseInt(new Date().getMonth())+1==month &&
                    new Date().getFullYear()==year) {
                    class_name='now_day';
                }

                else if (index%7==6 || index%7==5) {
                    class_name='holiday';
                }

                // Квадратик з числом
                calendarItemHtml+='<td class="'+class_name+'" data-attribute="'+ day+','+month+','+year+'" data-event="'+ day+','+month+'"' +
                    ' onclick="calendar.selectDate('+ day+','+month+','+year+');initToDoListForDate('+ day+','+month+','+year+');clickDate('+ day+','+month+','+year+');"><div class="day">'+day+'</div><\/td>';
                day++;
            }

            // Кінець рядка таблиці
            if (index%7==6) {
                calendarItemHtml+='<\/tr>';
            }
            index++;
        }
        while (index<final_index);

        calendarItemHtml+='<\/table>';

// визначення сезону та вибір зображення
        let div=document.getElementById(calendar.element_id);
        if (div) {
            div.innerHTML=calendarItemHtml
            if (month >= 1 && month < 3) {
                div.classList.remove("spring", "fall", "summer" )
                div.classList.add("winter");
            }
            else if (month >= 3 && month < 6) {
                div.classList.remove("winter", "fall", "summer" )
                div.classList.add("spring");
            }
            else if (month >= 6 && month < 9) {
                div.classList.remove("spring", "fall", "winter" )
                div.classList.add("summer");
            }
            else if (month >= 9 && month < 12) {
                div.classList.remove("spring", "winter", "summer" )
                div.classList.add("fall");
            }
            else if (month == 12) {
                div.classList.remove("spring", "fall", "summer" )
                div.classList.add("winter");
            }
        }
    upMark();
};

//створення підменю з вибором місяця
function openSelectMonth(year) {
    let blockMonthWrapper = document.body.querySelector('.block_month_wrapper');
    let navMonth = document.body.querySelector('.nav-month');
    if (blockMonthWrapper==null) {
        blockMonthWrapper = document.createElement('div');
        blockMonthWrapper.setAttribute('class', 'block_month_wrapper');
        let blockMonth = '<div id="block_month" class="block_month">';
        for (let i = 0; i < 12; i++) {
            blockMonth += '<div id="month-' + i + '" class="month month-' + i + '" onclick="drawCalendar('+(i+1)+','+year+');"> ' + calendar.monthName[i] + ' </div>';
        }
        blockMonth += '</div>';
        blockMonthWrapper.innerHTML = blockMonth;
        navMonth.append(blockMonthWrapper);
    } else {
        blockMonthWrapper.remove();
    }
}


//створення підменю з вибором року
function openSelectYear(year, month) {
    let blockYearWrapper = document.body.querySelector('.block_year_wrapper');
    let navYear = document.body.querySelector('.nav-year');
    if (blockYearWrapper==null) {
        blockYearWrapper = document.createElement('div');
        blockYearWrapper.setAttribute('class', 'block_year_wrapper');
        let blockYear = '<div id="block_year" class="block_year">';
        for (let i = 0; i < 12; i++) {
            blockYear += '<div id="year-' + (year + i) + '" class="year year-' + (year + i) + '" onclick="drawCalendar('+month+','+(year + i)+');"> ' + (year + i) + ' </div>';
        }
        blockYear += '</div>';
        blockYearWrapper.innerHTML = blockYear;
        navYear.append(blockYearWrapper);
    } else {
        blockYearWrapper.remove();
    }
}



calendar.element_id = 'calendar_section';

calendar.selectedDate={
    'Day' : new Date().getDate(),
    'Month' : parseInt(new Date().getMonth())+1,
    'Year' : new Date().getFullYear()
};


drawCalendar(
    calendar.selectedDate.Month,
    calendar.selectedDate.Year
);



