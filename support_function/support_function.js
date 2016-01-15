module.exports = {
    toYYYYMMDD: function(date){
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();
        return yyyy +'/'+ (mm[1]?mm:"0"+mm[0])+'/' + (dd[1]?dd:"0"+dd[0])+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    },
    toYYYYMMDD2: function(date){
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();
        return yyyy+'-' + (mm[1]?mm:"0"+mm[0]) +'-'+ (dd[1]?dd:"0"+dd[0])+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'.'+date.getMilliseconds();
    },
    toYYYYMMDD3: function(date){
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();
        var ho = date.getHours().toString();
        var mi = date.getMinutes().toString();
        var se = date.getSeconds().toString();
        return yyyy+'-' + (mm[1]?mm:"0"+mm[0]) +'-'+ (dd[1]?dd:"0"+dd[0])+' '+(ho[1]?ho:"0"+ho[0])+':'+(mi[1]?mi:"0"+mi[0])+':'+(se[1]?se:"0"+se[0]);
    },
    daydiff: function(first, second) {
        return (second-first)/(1000*60*60*24);
    },
    equalDay:function(first,second){
      if(first.getDay()==second.getDay() && first.getMonth()==second.getMonth() && first.getYear()==second.getYear()){
          return true;
      }
        else{
          return false;
      }
    },
    hourdiff:function(first, second) {
        return (second-first)/(1000*60*60);
    },
    minutediff:function(first, second) {
        return (second-first)/(1000*60);
    },
    getDOY:function(date){
        var onejan = new Date(date.getFullYear(),0,1);
        return Math.ceil((date - onejan) / 86400000);
    },
    getDateUTC:function(time){
        var firstTime = new Date(time);
        firstTime = new Date(firstTime.getUTCFullYear(),firstTime.getUTCMonth(),firstTime.getUTCDate(), firstTime.getUTCHours(), firstTime.getUTCMinutes(), firstTime.getUTCSeconds());
        return firstTime;
    },
    getTimeVietNam:function(minute){
        var result = minute.toFixed(0) +' phút';
        var hours = 0;
        if(minute<60){
            return result;
        }
        else{
            hours = minute/60;
            minute = minute%60;
            result = hours.toFixed(0) +' giờ '+ minute.toFixed(0)+' phút';
            return result;
        }

    }
};