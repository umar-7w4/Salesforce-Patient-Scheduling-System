public class PatientRelatedListClass {

    @AuraEnabled(cacheable=true)
    public static List<Condition__c> getConditions(String recId){
        return [SELECT Type__c, Severity__c, Condition_Code__c, Stage__c, Account__c, Account__r.Name, Name, Id FROM Condition__c where Account__c=: recId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Clinical_Encounter__c> getClinicalEncounters(String recId){
        return [SELECT Id, Name, Facility__c, Settings__c, Stage__c, Admission_Source__c, End_Date__c, Start_Date__c, Account__c FROM Clinical_Encounter__c where Account__c=: recId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Medication__c> getMedications(String recId){
        return [SELECT Id, Name, Medication__c, Frequency__c, Status__c, Dose__c, Prescribed_Date__c, Account__c FROM Medication__c where Account__c=: recId];
    }
}