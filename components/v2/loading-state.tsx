"use client";
import { Sprout } from "lucide-react";
import { usePreferences } from "@/components/providers/preferences-provider";
import styles from "./loading-state.module.css";
export function V2LoadingState(){const{t}=usePreferences();return <div className={styles.loading} role="status"><span className={styles.mark}><Sprout/></span><div className={styles.dots}><i/><i/><i/></div><p>{t("loading")}</p></div>;}
