
import React from "react";
import { useSwiper } from "swiper/react";
import { IonButton } from "@ionic/react";



export const ButtonSlider: React.FC< { slideDirection : "F"|"B", disabled?:boolean, onClick: any, label: string, color: string, className?:string, expand?: 'full' |'block' }> = ( { slideDirection, onClick, label, color,expand, disabled,className} ) => {
  
    const slider = useSwiper();
  
    function onMove(){
      if( slideDirection === 'F')
        slider.slideNext();
      if( slideDirection === 'B')
        slider.slidePrev();
      onClick();
    }
    return(
     <IonButton onClick={onMove} color={color} expand={expand} disabled={disabled} className={className}>{label}</IonButton>
    );
}

