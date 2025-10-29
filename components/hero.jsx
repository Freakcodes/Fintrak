"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";


const HeroSection=()=>{
    useEffect(()=>{
        const imageElement=imageRef.current;
        const handleScroll=()=>{
            const scrollPosition=window.scrollY;
            const scrollThreshold=100;

            if(scrollPosition>scrollThreshold)
            {
                imageElement.classList.add("scrolled");
            }else{
                imageElement.classList.remove("scrolled");
            }
        }
    window.addEventListener("scroll",handleScroll);
    return ()=> window.removeEventListener("scroll",handleScroll);
    },[])

    const imageRef=useRef();
    return (<div className="pb-20 px-4">
        <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
                Manage Your Finances <br/> with intelligence
            </h1>
            <p>
                An AI powered finance management platform that helps you track,
                analyze, and optimize your spending with real-time insights.
            </p>
            <div className="flex justify-center gap-4 mt-4">
                <Link href='/dashboard'>
                    <Button size="lg" className="px-8">
                        Get Started
                    </Button>
                </Link>
                <Link href='/dashboard'>
                    <Button size="lg" className="px-8" variant='outline'>
                        Watch Demo 
                    </Button>
                </Link>
            </div>
        </div>
        <div className="hero-image-wrapper">
            <div ref={imageRef} className="hero-image">
                <Image
                src='/hero.jpg'
                width={1180}
                height={720}
                alt="Hero section"
                className="mx-auto rounded-lg mt-10"
                priority
                />
            </div>

        </div>
    </div>)
}

export default HeroSection