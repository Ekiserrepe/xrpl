const xrpl = require("xrpl")


async function main() {
const client = new xrpl.Client("wss://s1.ripple.com/")
await client.connect()

//Enter your seed below
const standby_wallet = xrpl.Wallet.fromSeed('Enter your seed')





async function CreateOffer() {

    //Taxon number you want to create offers
    const Taxon = 1
    //Price on xrp drops 1 xrp = 1000000
    const price = "1000000"

    const account_info = await client.request({
        "command": "account_info",
        "account": standby_wallet.address
      })

    const nfts = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
    })
   
    let allNfts = nfts.result.account_nfts

    let marker = nfts.result.marker

    while(marker) {
        
      
        nfts.result.marker=marker
   
        nfts.ledger_index = nfts.result.ledger_current_index

        const nfts2 = await client.request({
            method: "account_nfts",
            account: standby_wallet.classicAddress,
            ledger_index: nfts.ledger_index,
            marker: nfts.result.marker
        })
        marker = nfts2.result.marker

       
        if(nfts2.result.account_nfts){
            allNfts= allNfts.concat(nfts2.result.account_nfts)
        } else {
            marker=null
        }

    }
    
   
    for (let i=0; i < allNfts.length; i++) {
    
        if(allNfts[i].NFTokenTaxon==Taxon){
            const transactionBlob = {
                
                    "TransactionType": "NFTokenCreateOffer",
                    "Account": standby_wallet.classicAddress,
                    "NFTokenID": allNfts[i].NFTokenID,
                    "Amount": price,
                    "Flags": 1
                
            }

            const tx =  await client.submit(transactionBlob, { wallet: standby_wallet} )

           
        }
    }



    client.disconnect()
}







CreateOffer()



}

main()
