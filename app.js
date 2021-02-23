const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const _=require('lodash');

const items =[];

const app = express();

app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin:todo123@cluster0.ewpsp.mongodb.net/todo?retryWrites=true&w=majority",{ useUnifiedTopology: true },{ useNewUrlParser: true } );

const itemsSchema = {

    name : String
}

const item = mongoose.model('item',itemsSchema);

const item1 = new item ({

    name : "Welcome to TO-DO List"

});

const item2 = new item ({

    name : "Simple Web Application "

});
const item3 = new item ({

    name : "Hope You Like It "

});

const defaultItems = [item1,item2,item3];

let listSchema = {
   
     name: String ,
     items: [itemsSchema]

}
const List = mongoose.model('List',listSchema);


app.get('/',function(req,res){

    item.find({},function(err,result){
       if (result.length === 0) {
           

        item.insertMany(defaultItems,function(err){

            if (err) {
                console.log(err);
            }
            else{
                console.log("Document Created");
            }
        })
        
          res.redirect('/');

       }
       else{
        
        res.render('list',{kindofday: "Today", newListitem : result});
       }
        
})

});

app.get("/:CustomList",function(req,res){
    let CustomLists = _.capitalize(req.params.CustomList);

    List.findOne({name:CustomLists},function(err,result){
            if(!err){
                if(!result){
                   const list = new List({

                        name:CustomLists,
                        items:defaultItems
                    });
                    list.save();
                    res.redirect('/'+ CustomLists);
                }
                else{
                    res.render('list',{kindofday: result.name, newListitem : result.items});
                }
            }  
    });


})


app.post("/",function(req,res){

    let itemName = req.body.newItem;
    let listName = req.body.button;
    

    const item4 = new item({

        name:itemName
    })

    if(listName === "Today"){
        item4.save();
        res.redirect('/');
     
    }
    else{
        List.findOne({name :listName},function(err,result){
            result.items.push(item4);
            result.save();
            res.redirect('/'+listName);
        })
         
    }
    
    

});

app.post("/delete",function(req,res){

   let checkedItem = req.body.check ;
   let listName = req.body.listName;

   if(listName === "Today"){

    item.findByIdAndDelete(checkedItem,function(err){
       
        console.log("Item Deleted");
        
        res.redirect('/');
    
    
       })
  }
  else{
      List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItem}}},function(err,result){

         if(!err){
             res.redirect('/'+listName);
         }

      })
      


  }

  
})

let port = process.env.PORT;
if(port == null || port == ""){
    port=3000;

}


app.listen(port,function(){

    console.log("Server listen on 3000");


})
