public class CampaignCreateClass {
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
}