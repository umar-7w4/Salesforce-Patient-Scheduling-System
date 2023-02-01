public with sharing class CampaignMembers {

    @AuraEnabled
    public static void setObjectToRecentItems(Id recordId) {
        if (!String.isBlank(recordId)) {
            Schema.SObjectType sObjectType = recordId.getSobjectType();
            String queryString = String.format('SELECT Id, Name FROM {0} WHERE Id =: recordId FOR VIEW', new List<Object>{sObjectType});
            Database.query(queryString);
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<CampaignMember> getCampaignMembers(String recId){
        return [SELECT Id, Status, Campaign.Name, CampaignId, HealthCloudGA__Account__r.Name, Name FROM CampaignMember where HealthCloudGA__Account__c=: recId];
    }

    @AuraEnabled
    public static String createCampaignMember(String accId, String campId, String status){

        String con = [Select Id, AccountId from Contact where AccountId =: accId].Id;
        CampaignMember c = new CampaignMember();
        c.HealthCloudGA__Account__c = accId;
        c.CampaignId = campId;
        c.Status = status;
        c.ContactId = con;
        try{
            insert c;
        }
        catch(Exception e){
            system.debug(e.getMessage());
        }
        return c.Id;
    }

    @AuraEnabled
    public static String fetchObjectName(String recId){
        return [Select Id, Name from Account where Id=:recId].Name;
    }

}