import { createContext, useState } from "react";
import run from "../config/gemini.js";

 export const Context = createContext()

 const ContextProvider = (props) =>{

   const [input, SetInput] = useState("");
   const [recentPrompt, SetRecentPrompt] = useState("");
   const [prevPrompts, SetPrevPrompts] = useState([]);
   const [showResult, SetShowResut] = useState(false);
   const [loading, SetLoading] = useState(false);
   const [resultData, SetResultData] = useState('0')


   const delaypara = (index, nextWord) =>{

       setTimeout(function(){
            SetResultData(prev =>prev+nextWord);
       },75*index)
   }

   const newChat = () =>{
        SetLoading(false);
        SetShowResut(false)
   }

   const onSent = async (prompt) => {
        SetResultData("");
        SetLoading(true);
        SetShowResut(true);
        let response ;
        if(prompt !== undefined){
            response = await run(prompt);
            SetRecentPrompt(prompt)
        }else{
             
            SetPrevPrompts(prev =>[...prev, input])
            SetRecentPrompt(input);
            response=await run(input);
        }
       
       
    
      let responseArray = response.split("**");
      let newResponse="";
      for (let i = 0; i < responseArray.length; i++) {
          if(i === 0 || i%2 !==1){
                newResponse += responseArray[i]
          }
          else{
              newResponse += "<b>" +responseArray[i]+"</b>";
          }
      }
      let newResponse2 = newResponse.split("*").join("</br>");
      let newResponseArray = newResponse2.split(" ")
      for(let i =0; i< newResponseArray.length; i++){
         const nextWord = newResponseArray[i];
         delaypara(i, nextWord+" ")
      }
    //   SetResultData(newResponse2);
      SetLoading(false);
      SetInput("");
   }
  


        const contextValue ={
             prevPrompts,
             SetPrevPrompts,
             onSent,
             SetRecentPrompt,
             recentPrompt,
             showResult,
             loading,
             resultData,
             input,
             SetInput,
             newChat

        }

        return(

            <Context.Provider value={contextValue}>
                {props.children}
            </Context.Provider>
        )

 }

 export default ContextProvider;