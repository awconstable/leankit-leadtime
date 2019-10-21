#!/usr/bin/env node

const argv = require('yargs')
.option('account', { 
    describe:'Specify the LeanKit account name (https://<account id>.leankit.com)'
})
.option('email', {
    describe:'The email address used to log in to LeanKit'
})
.option('password', {
    alias: 'pass', 
    describe:'The password used to log in to LeanKit'
})
.option('boardId', {
    alias: 'bid', 
    describe:'The id of the board you want to calculate lead time for'
})
.option('month', {
    alias: 'm', 
    describe:'The month as a date to lead time calculation during. Format: YYYY-MM'
})
.demandOption(['account', 'email', 'password', 'boardId', 'month'], 'Please provide all arguments to work with this tool')
.help('help')
.argv

const LeanKitClient = require( "leankit-client" );

const auth = {
    account: argv.account,
    email: argv.email,
    password: argv.password
};
const client = LeanKitClient( auth );

const main = async () => {

    const query = {
        board: argv.boardId,
        limit: 1000
    };

    client.card.list( query ).then(processResponse).catch( err => {
        console.error( "Error getting cards:", err );
    } );

}

function processResponse(response){
    processCards(response.data.cards);
}

function processCards(cards) {

    var totalLeadTime = 0;
    var averageLeadTime = 0;
    var cardCount = 0;

    for(i = 0; i < cards.length; i++){
        var leadTime = processCard(cards[i]);

        if(typeof leadTime !== 'undefined'){
            totalLeadTime += leadTime;
            cardCount++;
        }
    }
    averageLeadTime = Math.round((totalLeadTime / cardCount) * 10) / 10;

    console.log("Card Count : " + cardCount);
    console.log("Average Lead Time (Days): " + averageLeadTime);
}

function inScopeCheck(cardFinishTime){
    var cardFinish = new Date();
    cardFinish.setTime(cardFinishTime);

    var leadTimeMonth = new Date();
    leadTimeMonth.setTime(Date.parse(argv.month));

    if(leadTimeMonth.getMonth() === cardFinish.getMonth() && leadTimeMonth.getFullYear() === cardFinish.getFullYear()){
        return true;
    }
    return false;
}

function processCard(card){
    if(typeof card !== 'undefined' && card.actualFinish){
        const created = Date.parse(card.createdOn);
        const finish = Date.parse(card.actualFinish);
        const leadTimeMillis = finish - created;
        const leadTimeSeconds = leadTimeMillis / 1000;
        const leadTimeDays = leadTimeMillis / 1000 / 60 / 60 / 24;

        //Filter out cards less a lead time of less than 30 mins (It looks like LeanKit does this in it's cycle time chart)
        if(inScopeCheck(finish) && leadTimeSeconds > (60 * 30)){
            return leadTimeDays;
        }
    };
}

main();
