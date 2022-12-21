public with sharing class Appointment {

    @AuraEnabled
    public static List<Appointment__c> getAppointments(String dayOfTheWeek, DateTime startTime, DateTime endTime, String distance, String location){


        String query;
        String condition = (String.isNotBlank(dayOfTheWeek) ? 'Days_of_the_week__c LIKE \'' + '%' + dayOfTheWeek + '%\'' : '');

        condition += (startTime != null
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            '( Start_Time__c >= ' +
            startTime : '');


        condition += (endTime != null
        ? (String.isNotBlank(condition) ? +' AND ' : '') +
            ' End_Time__c <= ' +
            endTime +' )' : '');       

        condition += (String.isNotBlank(distance)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Distance__c = \'' +
            distance +
            '\''
        : '');

        condition += (String.isNotBlank(location)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Location__c LIKE \'' +
            '%' +
            location +
            '%\''
        : '');

        System.debug('condition '+condition);
        if (String.isNotBlank(condition)) {
            query = 'SELECT Id, Name, Provider__c, Account__c, First_Name__c, Last_Name__c, Days_of_the_week__c, Location__c, Distance__c, Appointment_Start_Time__c, Appointment_End_Time__c, First_Available__c FROM Appointment__c WHERE ' +
                condition+' ORDER BY First_Name__c';

        } else {
            query = 'SELECT Id, Name, Provider__c, Account__c, First_Name__c, Last_Name__c, Days_of_the_week__c, Location__c, Distance__c, Appointment_Start_Time__c, Appointment_End_Time__c, First_Available__c FROM Appointment__c LIMIT 200';
        }
        System.debug(query);
        List<Appointment__c> records = new List<Appointment__c>();
        if(query != null){
            try{
                records = Database.query(query);
            }
            catch(Exception e){
                System.debug(e.getMessage());
            }
        }

        return records;
    }
}
