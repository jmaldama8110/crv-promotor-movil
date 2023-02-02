import { IonItem, IonLabel, IonRadio, IonRadioGroup, IonSearchbar } from "@ionic/react";
import { useEffect, useState } from "react";
import "./SelectDropSearch.css";

export interface SearchData{
  id: string;
  rev?: string;
  etiqueta: string;
  data?:any;
}
interface SearchToolProps {
  description: string;
  dataList: SearchData[];
  setSelectedItemFx: any;
  currentItem?: SearchData;
}

export const SelectDropSearch: React.FC<SearchToolProps> = ({ dataList,setSelectedItemFx, currentItem, description }) => {

  const [searchText, setSearchText] = useState< string >('');
  const [searchList, setSearchList] = useState<SearchData[]>([])
  const [visibleList, setVisibleList] = useState<boolean>(true);

  function onFilter (){
    let searchResult = [];
    const keyWord = searchText?.toUpperCase().trim();
  
    for( let i=0; (i < dataList.length) ; i++){
      const itemText = dataList[i].etiqueta.toUpperCase();
      const item = dataList[i];
      if( itemText.indexOf(keyWord) > -1 && keyWord && (searchResult.length <= 5) ){
          searchResult.push(item);
      }
    }
    
    setSearchList(searchResult);
    
  }
  useEffect( ()=> {
    if( currentItem && currentItem.id  ){
      setSearchText(currentItem.etiqueta);
      setVisibleList(false);
    } 
  },[currentItem])

  useEffect( ()=> {
    onFilter();
  },[searchText])

  function onRestoreList(){
    setSelectedItemFx({ id:0, etiqueta: "",rev: ""})
    setVisibleList(true);
    setSearchList([]);
  }
  
  function onSelectItem (e:any){
    const itemSelected = dataList.find((i:any)=> i.id === e.target.value);
    setSelectedItemFx(itemSelected);
    setSearchText(itemSelected!.etiqueta);
    setVisibleList(false)
  }

  return (
    <div className="search-tool">
      <IonSearchbar value={searchText}
                    placeholder={description}
                    onIonChange={(e) => setSearchText(e.detail.value!)}
                    onIonClear={onRestoreList}
                    animated
                    ></IonSearchbar>
                    {visibleList &&
                      <div className='search-list'>
                    <IonRadioGroup onIonChange={onSelectItem}>
                    { searchList.map((i:SearchData)=> 
                          <IonItem className='searchlist-item' key={i.id}>
                            <IonLabel>{i.etiqueta}</IonLabel>
                            <IonRadio value={i.id}></IonRadio>
                          </IonItem>
                            ) }                    
                    </IonRadioGroup></div>  }
    </div>
  );
};
