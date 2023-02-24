import { IonIcon } from "@ionic/react";
import { starSharp, starOutline } from "ionicons/icons";

export const StarRank: React.FC< { starArray: boolean[], 
                                setStarArray:React.Dispatch<React.SetStateAction<boolean[]>> }> = ({starArray, setStarArray}) => {
    function toggleStart(e:any) {
        const idStar = parseInt(e.target.id.split("-")[2])
        /// need to plot from 0 to idStart
        const newArray = starArray.map( (i:boolean,n:number) =>( n <= idStar ))
        setStarArray(newArray);
    }                                       
    return (
        <>
        {starArray.map( (i:boolean,n:number) => 
            ( <IonIcon icon={ i ? starSharp : starOutline} key={n} onClick={toggleStart} id={`icon-start-${n}`}></IonIcon> ))
            }
        </>
    );
}