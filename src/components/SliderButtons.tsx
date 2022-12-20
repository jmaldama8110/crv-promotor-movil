
import React from "react";
import { useSwiper } from "swiper/react";
import { IonButton } from "@ionic/react";

interface SliderButtonProps {
    enabled: boolean;
    expand: "full" | "block" | undefined;
    color: string;
    text: string;
    fill?:  "clear" | "outline" | "solid" | "default" | undefined;
    to?: number;
    onAction?: any; 
}

export const IonButtonNext: React.FC<SliderButtonProps> = ( props ) => {
    const swiper = useSwiper();
    const onNextAction = () => {
        swiper.slideNext()
    }
    return (
        <IonButton onClick={onNextAction} expand={props.expand} color={props.color} disabled={!props.enabled} fill={props.fill} className="margen-abajo">{props.text}</IonButton>
    );
}


export const IonButtonPrev: React.FC<SliderButtonProps> = ( props ) => {
    const swiper = useSwiper();
    return (
        <IonButton onClick={()=>swiper.slidePrev()} expand={props.expand} color={props.color} disabled={!props.enabled} fill={props.fill}>{props.text}</IonButton>
    );
}

export const IonButttonTo: React.FC<SliderButtonProps> = ( props ) => {
    const swiper = useSwiper();
    const onActionClick = () =>{
        swiper.slideTo(props.to!);
        props.onAction();
    }
    return (
        <IonButton onClick={onActionClick} expand={props.expand} color={props.color} disabled={!props.enabled} fill={props.fill}>{props.text}</IonButton>
    );
}

