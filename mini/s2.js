/* The Examined Life: Level II short games (the Marble Coast). Plan 5. Loaded after l1.js-l4.js (fx.js first, boss.js last).
   Source: work_src/s2/<id>.js, one file per game, assembled by tools/build_mini.py s2. Do not edit the GAME blocks here. */
/* MINI_ART:BEGIN */
/* written by tools/l2p5_mini_art.py (Phase 41A): asset ids, atlas rects, people rects and pivots, traced geometry (<who>_s) */
MINI_ART.socrates_s={"atlas":"769758120bae67c182f0d13a9f7d90c1","people":"a9ea7f3b251db61a4d0fa8229f1657a2","rects":{"stele":[1,1,42,56],"cloak":[44,1,44,48],"lampstand":[89,1,25,40],"gate":[115,1,38,40],"lyre":[154,1,35,36],"shield":[190,1,36,36],"house":[227,1,40,32],"scales":[268,1,36,32],"robe":[305,1,26,28],"mirror":[332,1,24,28],"sandals":[357,1,28,25],"ring":[386,1,24,23],"hands":[411,1,28,22],"coins":[440,1,28,21],"bowl":[469,1,28,19],"laurel":[498,1,28,17]},"prects":{"soc_walk_up_1":[1,1,14,24],"rich_walk_0":[16,1,14,24],"rich_walk_1":[31,1,14,24],"rich_place":[46,1,19,24],"soc_walk_left_0":[66,1,14,23],"soc_walk_left_1":[81,1,14,23],"soc_walk_right_0":[96,1,14,23],"soc_walk_right_1":[111,1,14,23],"soc_walk_up_0":[126,1,14,23],"soc_idle_0":[141,1,14,23],"soc_idle_1":[156,1,14,22],"friend0_talk_0":[171,1,14,20],"friend0_talk_1":[186,1,19,20],"friend1_talk_0":[206,1,14,20],"friend1_talk_1":[221,1,19,20],"youth0_talk_0":[241,1,14,20],"youth0_talk_1":[256,1,19,20],"youth1_talk_0":[276,1,14,20],"youth1_talk_1":[291,1,19,20],"youth2_talk_0":[311,1,18,20],"youth2_talk_1":[330,1,21,20],"youth3_talk_0":[352,1,14,20],"youth3_talk_1":[367,1,19,20],"soc_sit":[387,1,14,19]},"pivots":{"soc_walk_left_0":[6,23],"soc_walk_left_1":[6,23],"soc_walk_right_0":[8,23],"soc_walk_right_1":[8,23],"soc_walk_up_0":[10,23],"soc_walk_up_1":[5,24],"soc_sit":[8,19],"soc_idle_0":[8,23],"soc_idle_1":[8,22],"friend0_talk_0":[8,20],"friend0_talk_1":[12,20],"friend1_talk_0":[8,20],"friend1_talk_1":[12,20],"rich_walk_0":[8,24],"rich_walk_1":[8,24],"rich_place":[8,24],"youth0_talk_0":[8,20],"youth0_talk_1":[12,20],"youth1_talk_0":[8,20],"youth1_talk_1":[12,20],"youth2_talk_0":[10,20],"youth2_talk_1":[10,20],"youth3_talk_0":[8,20],"youth3_talk_1":[12,20]},"bg":["37be0934f02309525d74afd7b31646c1"],"geo":{"crop":"centre","gate":[26,86],"gateOpening":[14,72,40,98],"colonnade":[56,40,192,78],"acropolis":[140,4,192,38],"square":[64,98,160,250],"housesLeft":[0,100,64,300],"housesRight":[160,100,192,290],"paintedLamps":[[72,120],[140,120],[60,148],[144,148],[52,198],[150,198]],"darkBandFrom":252}};
MINI_ART.aristotle_s={"atlas":"18d969338d22058ec31a60d63933e6c7","people":"9a7885a84894a0e6447a81e80fa309a4","rects":{"column":[1,1,42,140],"target":[44,1,77,80],"tablet":[122,1,56,40],"figtree":[179,1,39,40],"web":[219,1,32,31],"honeycomb":[252,1,26,28],"arrow":[279,1,24,24],"swallow":[304,1,24,24],"figs":[329,1,22,24],"nest":[352,1,24,22],"spider":[377,1,15,16],"frog":[393,1,20,16],"lizard":[414,1,24,16],"bee":[439,1,16,14],"snail":[456,1,20,11]},"prects":{"stu_idle":[1,1,14,24],"stu_draw":[16,1,15,24],"stu_loose":[32,1,18,24],"stud0_walk_0":[51,1,14,24],"stud0_walk_1":[66,1,14,24],"stud1_walk_0":[81,1,15,24],"stud1_walk_1":[97,1,15,24],"stud2_walk_0":[113,1,14,24],"stud2_walk_1":[128,1,14,24],"stud3_walk_0":[143,1,18,24],"stud3_walk_1":[162,1,18,24],"stud4_walk_0":[181,1,15,24],"stud4_walk_1":[197,1,15,24],"ari_tab_0":[213,1,14,22],"ari_write":[228,1,14,22],"ari_smooth":[243,1,14,22],"ari_walk_0":[258,1,14,22],"ari_walk_1":[273,1,14,22],"ari_point":[288,1,19,22],"ari_tab_1":[308,1,14,21],"stud0_sit":[323,1,14,20],"stud1_sit":[338,1,14,20],"stud2_sit":[353,1,14,20],"stud3_sit":[368,1,18,20],"stud4_sit":[387,1,14,20],"ari_sit":[402,1,14,18]},"pivots":{"ari_tab_0":[8,22],"ari_tab_1":[8,21],"ari_write":[8,22],"ari_smooth":[8,22],"ari_walk_0":[8,22],"ari_walk_1":[8,22],"ari_point":[8,22],"ari_sit":[8,18],"stu_idle":[8,24],"stu_draw":[8,24],"stu_loose":[8,24],"stud0_walk_0":[8,24],"stud0_walk_1":[8,24],"stud0_sit":[8,20],"stud1_walk_0":[8,24],"stud1_walk_1":[8,24],"stud1_sit":[8,20],"stud2_walk_0":[8,24],"stud2_walk_1":[8,24],"stud2_sit":[8,20],"stud3_walk_0":[10,24],"stud3_walk_1":[10,24],"stud3_sit":[10,20],"stud4_walk_0":[8,24],"stud4_walk_1":[8,24],"stud4_sit":[8,20]},"bg":["fbb5ff3346d659c476aed978eb2058cc"],"geo":{"crop":"centre","colonnade":[0,0,192,52],"colonnadeFloor":50,"lawn":[20,52,168,260],"path":[86,52,106,270],"grotto":[132,76,192,128],"grottoMouth":[166,110],"treesLeft":[0,52,22,260],"treesRight":[168,52,192,260],"target":[96,104],"darkBandFrom":262}};
MINI_ART.epicurus_s={"atlas":"a48b4cc41e182387425cdc012d318e87","people":"b31c21b119e176868a0f7f21f6adb8aa","rects":{"lant_cloud":[1,1,24,40],"lant_moon":[26,1,24,40],"lant_bowl":[51,1,24,40],"lant_star":[76,1,24,40],"st_ring":[101,1,22,24],"st_jar":[124,1,17,24],"st_brooch":[142,1,21,24],"in_lyre":[164,1,20,24],"in_scroll":[185,1,24,24],"in_figs":[210,1,23,24],"moth_gods":[234,1,32,22],"moth_pain":[267,1,32,22],"in_stars":[300,1,24,20],"moth_death":[325,1,32,19],"moth_want":[358,1,32,19],"st_hat":[391,1,24,15]},"prects":{"man_plain_stand_0":[1,1,14,24],"man_plain_walk_0":[16,1,14,24],"man_plain_walk_1":[31,1,14,24],"man_fine_stand_0":[46,1,14,24],"man_fine_walk_0":[61,1,14,24],"man_fine_walk_1":[76,1,14,24],"man_hat_stand_0":[91,1,18,24],"man_hat_stand_1":[110,1,18,24],"man_hat_walk_0":[129,1,18,24],"man_hat_walk_1":[148,1,18,24],"man_satchel_stand_0":[167,1,15,24],"man_satchel_walk_0":[183,1,15,24],"man_satchel_walk_1":[199,1,15,24],"woman_plain_stand_0":[215,1,14,24],"woman_plain_walk_0":[230,1,14,24],"woman_plain_walk_1":[245,1,14,24],"woman_fine_stand_0":[260,1,14,24],"woman_fine_walk_0":[275,1,14,24],"woman_fine_walk_1":[290,1,14,24],"woman_hat_stand_0":[305,1,18,24],"woman_hat_stand_1":[324,1,18,24],"woman_hat_walk_0":[343,1,18,24],"woman_hat_walk_1":[362,1,18,24],"woman_satchel_stand_0":[381,1,15,24],"woman_satchel_walk_0":[397,1,15,24],"woman_satchel_walk_1":[413,1,15,24],"oldman_plain_stand_0":[429,1,14,24],"oldman_plain_walk_0":[444,1,14,24],"oldman_plain_walk_1":[459,1,14,24],"oldman_fine_stand_0":[474,1,14,24],"oldman_fine_walk_0":[489,1,14,24],"oldman_fine_walk_1":[1,26,14,24],"oldman_hat_stand_0":[16,26,18,24],"oldman_hat_stand_1":[35,26,18,24],"oldman_hat_walk_0":[54,26,18,24],"oldman_hat_walk_1":[73,26,18,24],"oldman_satchel_stand_0":[92,26,15,24],"oldman_satchel_walk_0":[108,26,15,24],"oldman_satchel_walk_1":[124,26,15,24],"oldwoman_plain_stand_0":[140,26,14,24],"oldwoman_plain_walk_0":[155,26,14,24],"oldwoman_plain_walk_1":[170,26,14,24],"oldwoman_fine_stand_0":[185,26,14,24],"oldwoman_fine_walk_0":[200,26,14,24],"oldwoman_fine_walk_1":[215,26,14,24],"oldwoman_hat_stand_0":[230,26,18,24],"oldwoman_hat_stand_1":[249,26,18,24],"oldwoman_hat_walk_0":[268,26,18,24],"oldwoman_hat_walk_1":[287,26,18,24],"oldwoman_satchel_stand_0":[306,26,15,24],"oldwoman_satchel_walk_0":[322,26,15,24],"oldwoman_satchel_walk_1":[338,26,15,24],"man_plain_stand_1":[354,26,14,23],"man_fine_stand_1":[369,26,14,23],"man_satchel_stand_1":[384,26,15,23],"woman_plain_stand_1":[400,26,14,23],"woman_fine_stand_1":[415,26,14,23],"woman_satchel_stand_1":[430,26,15,23],"oldman_plain_stand_1":[446,26,14,23],"oldman_fine_stand_1":[461,26,14,23],"oldman_satchel_stand_1":[476,26,15,23],"oldwoman_plain_stand_1":[492,26,14,23],"oldwoman_fine_stand_1":[1,51,14,23],"oldwoman_satchel_stand_1":[16,51,15,23],"epi_walk_0":[32,51,14,22],"epi_walk_1":[47,51,14,22],"man_plain_bow":[62,51,14,22],"man_fine_bow":[77,51,14,22],"man_hat_bow":[92,51,18,22],"man_satchel_bow":[111,51,15,22],"woman_plain_bow":[127,51,14,22],"woman_fine_bow":[142,51,14,22],"woman_hat_bow":[157,51,18,22],"woman_satchel_bow":[176,51,15,22],"oldman_plain_bow":[192,51,14,22],"oldman_fine_bow":[207,51,14,22],"oldman_hat_bow":[222,51,18,22],"oldman_satchel_bow":[241,51,15,22],"oldwoman_plain_bow":[257,51,14,22],"oldwoman_fine_bow":[272,51,14,22],"oldwoman_hat_bow":[287,51,18,22],"oldwoman_satchel_bow":[306,51,15,22],"man_plain_talk_0":[322,51,14,20],"man_plain_talk_1":[337,51,19,20],"man_fine_talk_0":[357,51,14,20],"man_fine_talk_1":[372,51,19,20],"man_hat_talk_0":[392,51,18,20],"man_hat_talk_1":[411,51,21,20],"man_satchel_talk_0":[433,51,14,20],"man_satchel_talk_1":[448,51,19,20],"woman_plain_talk_0":[468,51,14,20],"woman_plain_talk_1":[483,51,19,20],"woman_fine_talk_0":[1,75,14,20],"woman_fine_talk_1":[16,75,19,20],"woman_hat_talk_0":[36,75,18,20],"woman_hat_talk_1":[55,75,21,20],"woman_satchel_talk_0":[77,75,14,20],"woman_satchel_talk_1":[92,75,19,20],"oldman_plain_talk_0":[112,75,14,20],"oldman_plain_talk_1":[127,75,19,20],"oldman_fine_talk_0":[147,75,14,20],"oldman_fine_talk_1":[162,75,19,20],"oldman_hat_talk_0":[182,75,18,20],"oldman_hat_talk_1":[201,75,21,20],"oldman_satchel_talk_0":[223,75,14,20],"oldman_satchel_talk_1":[238,75,19,20],"oldwoman_plain_talk_0":[258,75,14,20],"oldwoman_plain_talk_1":[273,75,19,20],"oldwoman_fine_talk_0":[293,75,14,20],"oldwoman_fine_talk_1":[308,75,19,20],"oldwoman_hat_talk_0":[328,75,18,20],"oldwoman_hat_talk_1":[347,75,21,20],"oldwoman_satchel_talk_0":[369,75,14,20],"oldwoman_satchel_talk_1":[384,75,19,20]},"pivots":{"epi_walk_0":[8,22],"epi_walk_1":[8,22],"man_plain_stand_0":[8,24],"man_plain_stand_1":[8,23],"man_plain_bow":[8,22],"man_plain_walk_0":[8,24],"man_plain_walk_1":[8,24],"man_plain_talk_0":[8,20],"man_plain_talk_1":[12,20],"man_fine_stand_0":[8,24],"man_fine_stand_1":[8,23],"man_fine_bow":[8,22],"man_fine_walk_0":[8,24],"man_fine_walk_1":[8,24],"man_fine_talk_0":[8,20],"man_fine_talk_1":[8,20],"man_hat_stand_0":[10,24],"man_hat_stand_1":[10,24],"man_hat_bow":[10,22],"man_hat_walk_0":[10,24],"man_hat_walk_1":[10,24],"man_hat_talk_0":[10,20],"man_hat_talk_1":[10,20],"man_satchel_stand_0":[8,24],"man_satchel_stand_1":[8,23],"man_satchel_bow":[8,22],"man_satchel_walk_0":[8,24],"man_satchel_walk_1":[8,24],"man_satchel_talk_0":[8,20],"man_satchel_talk_1":[12,20],"woman_plain_stand_0":[8,24],"woman_plain_stand_1":[8,23],"woman_plain_bow":[8,22],"woman_plain_walk_0":[8,24],"woman_plain_walk_1":[8,24],"woman_plain_talk_0":[8,20],"woman_plain_talk_1":[12,20],"woman_fine_stand_0":[8,24],"woman_fine_stand_1":[8,23],"woman_fine_bow":[8,22],"woman_fine_walk_0":[8,24],"woman_fine_walk_1":[8,24],"woman_fine_talk_0":[8,20],"woman_fine_talk_1":[8,20],"woman_hat_stand_0":[10,24],"woman_hat_stand_1":[10,24],"woman_hat_bow":[10,22],"woman_hat_walk_0":[10,24],"woman_hat_walk_1":[10,24],"woman_hat_talk_0":[10,20],"woman_hat_talk_1":[10,20],"woman_satchel_stand_0":[8,24],"woman_satchel_stand_1":[8,23],"woman_satchel_bow":[8,22],"woman_satchel_walk_0":[8,24],"woman_satchel_walk_1":[8,24],"woman_satchel_talk_0":[8,20],"woman_satchel_talk_1":[12,20],"oldman_plain_stand_0":[8,24],"oldman_plain_stand_1":[8,23],"oldman_plain_bow":[8,22],"oldman_plain_walk_0":[8,24],"oldman_plain_walk_1":[8,24],"oldman_plain_talk_0":[8,20],"oldman_plain_talk_1":[12,20],"oldman_fine_stand_0":[8,24],"oldman_fine_stand_1":[8,23],"oldman_fine_bow":[8,22],"oldman_fine_walk_0":[8,24],"oldman_fine_walk_1":[8,24],"oldman_fine_talk_0":[8,20],"oldman_fine_talk_1":[8,20],"oldman_hat_stand_0":[10,24],"oldman_hat_stand_1":[10,24],"oldman_hat_bow":[10,22],"oldman_hat_walk_0":[10,24],"oldman_hat_walk_1":[10,24],"oldman_hat_talk_0":[10,20],"oldman_hat_talk_1":[10,20],"oldman_satchel_stand_0":[8,24],"oldman_satchel_stand_1":[8,23],"oldman_satchel_bow":[8,22],"oldman_satchel_walk_0":[8,24],"oldman_satchel_walk_1":[8,24],"oldman_satchel_talk_0":[8,20],"oldman_satchel_talk_1":[12,20],"oldwoman_plain_stand_0":[8,24],"oldwoman_plain_stand_1":[8,23],"oldwoman_plain_bow":[8,22],"oldwoman_plain_walk_0":[8,24],"oldwoman_plain_walk_1":[8,24],"oldwoman_plain_talk_0":[8,20],"oldwoman_plain_talk_1":[12,20],"oldwoman_fine_stand_0":[8,24],"oldwoman_fine_stand_1":[8,23],"oldwoman_fine_bow":[8,22],"oldwoman_fine_walk_0":[8,24],"oldwoman_fine_walk_1":[8,24],"oldwoman_fine_talk_0":[8,20],"oldwoman_fine_talk_1":[8,20],"oldwoman_hat_stand_0":[10,24],"oldwoman_hat_stand_1":[10,24],"oldwoman_hat_bow":[10,22],"oldwoman_hat_walk_0":[10,24],"oldwoman_hat_walk_1":[10,24],"oldwoman_hat_talk_0":[10,20],"oldwoman_hat_talk_1":[10,20],"oldwoman_satchel_stand_0":[8,24],"oldwoman_satchel_stand_1":[8,23],"oldwoman_satchel_bow":[8,22],"oldwoman_satchel_walk_0":[8,24],"oldwoman_satchel_walk_1":[8,24],"oldwoman_satchel_talk_0":[8,20],"oldwoman_satchel_talk_1":[12,20]},"bg":["93513700f7f600809389bff8c8351750"],"geo":{"crop":"centre","gate":[18,212],"gateOpening":[10,200,26,224],"wallLeft":[0,0,10,320],"lamp":[96,146],"lampFlame":[96,136],"benches":[16,78,192,96],"benchY":88,"beds":[20,0,192,30],"trees":[20,34,192,70],"gravel":[20,100,192,256],"darkBandFrom":256}};
MINI_ART.seneca_s={"atlas":"cfcb9c1c7dbacc1d8494cf5e097acdfc","people":"cd5b7c325400b27624f68af074026f7e","rects":{"letter":[1,1,160,200],"chair":[162,1,63,96],"document":[226,1,96,95],"ring":[323,1,64,61],"squall":[388,1,48,43],"boat":[437,1,29,40],"seal":[467,1,40,40],"rock_b":[508,1,40,39],"rock_a":[549,1,32,32],"lamp":[582,1,24,21]},"prects":{"friend_wave_0":[1,1,19,28],"friend_wave_1":[21,1,19,28],"sen_idle_0":[41,1,14,22],"sen_calm":[56,1,14,22],"sen_idle_1":[71,1,14,21]},"pivots":{"sen_idle_0":[8,22],"sen_idle_1":[8,21],"sen_calm":[8,22],"friend_wave_0":[10,28],"friend_wave_1":[10,28]},"bg":["68ed02ff5f55cade5a11873d47851e58"],"geo":{"crop":"top","bay":[0,0,192,224],"openWater":[40,30,152,224],"rocksLeft":[0,60,40,172],"rocksRight":[152,66,192,182],"harborLight":[96,8],"balustrade":[0,226,192,270],"table":[30,272,160,320],"tableLamp":[66,270],"note":"the brief's voyage boat at y 222 sits on the balustrade top (y 226); the bay ends at y 224"}};
MINI_ART.epictetus_s={"atlas":"dc2f364aed6f847a395331b594ed33db","people":"ea1f4d28ec1e210d605eb248861607c3","rects":{"wall":[1,1,46,48],"gate_shut":[48,1,48,48],"gate_open":[97,1,48,48],"crutch":[146,1,15,48],"block":[162,1,48,48],"slab":[211,1,96,48],"lever_up":[308,1,17,32],"lever_down":[326,1,18,32],"chain":[345,1,48,13]},"prects":{"epc_cr_step":[1,1,15,24],"stud0_0":[17,1,15,24],"stud1_0":[33,1,14,24],"epc_down_1":[48,1,13,23],"epc_up_1":[62,1,13,23],"stud0_1":[76,1,15,23],"stud1_1":[92,1,14,23],"epc_down_0":[107,1,13,22],"epc_up_0":[121,1,13,22],"epc_left_0":[135,1,14,22],"epc_left_1":[150,1,13,22],"epc_right_0":[164,1,14,22],"epc_right_1":[179,1,13,22],"epc_cr_idle_0":[193,1,15,22],"epc_cr_walk_0":[209,1,15,22],"epc_cr_walk_1":[225,1,15,22],"epc_cr_idle_1":[241,1,15,21],"epc_cr_sit":[257,1,15,18]},"pivots":{"epc_down_0":[10,22],"epc_down_1":[5,23],"epc_up_0":[10,22],"epc_up_1":[5,23],"epc_left_0":[6,22],"epc_left_1":[6,22],"epc_right_0":[8,22],"epc_right_1":[8,22],"epc_cr_idle_0":[9,22],"epc_cr_idle_1":[9,21],"epc_cr_step":[9,24],"epc_cr_walk_0":[8,22],"epc_cr_walk_1":[8,22],"epc_cr_sit":[9,18],"stud0_0":[8,24],"stud0_1":[8,23],"stud1_0":[8,24],"stud1_1":[8,23]},"bg":["6f9f61ee7dc0db216a9caa92279f44fe"],"geo":{"crop":"centre","cliffFace":[122,80,192,270],"cliffTop":80,"school":[136,22,192,80],"door":[150,66],"doorBox":[144,56,156,78],"ledgeLeft":[0,192,52,270],"ledgeTop":192,"gapAir":[52,0,122,236],"rubble":[52,236,192,272],"moon":[64,38],"darkBandFrom":276}};
MINI_ART.marcus_s={"atlas":"d32f4b6bb18293bc4cfbb947b2c2c4ad","people":"af3c7248b37ac03dc6c2929dba762329","rects":{"branch":[1,1,40,30],"cloud":[42,1,36,30],"firewood":[79,1,32,26],"bucket":[112,1,18,24],"pouch":[131,1,23,24],"notebook":[155,1,28,24],"ice":[184,1,36,22],"laurel":[221,1,28,20],"rope":[250,1,24,19],"letter":[275,1,24,18]},"prects":{"v2_provoke":[1,1,15,25],"v3_carry_1":[17,1,18,25],"v0_walk_0":[36,1,14,24],"v0_walk_1":[51,1,14,24],"v0_provoke":[66,1,17,24],"v0_carry_0":[84,1,14,24],"v0_carry_1":[99,1,14,24],"v1_walk_0":[114,1,14,24],"v1_walk_1":[129,1,14,24],"v1_provoke":[144,1,14,24],"v1_carry_0":[159,1,14,24],"v1_carry_1":[174,1,14,24],"v2_walk_0":[189,1,15,24],"v2_walk_1":[205,1,15,24],"v2_carry_0":[221,1,15,24],"v2_carry_1":[237,1,15,24],"v3_walk_0":[253,1,18,24],"v3_walk_1":[272,1,18,24],"v3_provoke":[291,1,18,24],"v3_carry_0":[310,1,18,24],"v4_walk_0":[329,1,14,24],"v4_walk_1":[344,1,14,24],"v4_provoke":[359,1,14,24],"v4_carry_0":[374,1,14,24],"v4_carry_1":[389,1,14,24],"v5_walk_0":[404,1,14,24],"v5_walk_1":[419,1,14,24],"v5_provoke":[434,1,14,24],"v5_carry_0":[449,1,14,24],"v5_carry_1":[464,1,14,24],"v0_soft":[479,1,14,23],"v1_soft":[494,1,14,23],"v2_soft":[1,27,15,23],"v3_soft":[17,27,18,23],"v4_soft":[36,27,14,23],"v5_soft":[51,27,14,23],"mar_idle_0":[66,27,14,22],"mar_meet":[81,27,19,22],"mar_walk_0":[101,27,14,22],"mar_walk_1":[116,27,14,22],"mar_idle_1":[131,27,14,21],"mar_breathe":[146,27,14,19],"mar_stoop":[161,27,15,19],"mar_sit_0":[177,27,14,18],"mar_answer":[192,27,19,18],"mar_write":[212,27,14,18],"mar_sit_1":[227,27,14,17]},"pivots":{"mar_sit_0":[8,18],"mar_sit_1":[8,17],"mar_breathe":[8,19],"mar_answer":[8,18],"mar_write":[8,18],"mar_idle_0":[8,22],"mar_idle_1":[8,21],"mar_meet":[8,22],"mar_walk_0":[8,22],"mar_walk_1":[8,22],"mar_stoop":[8,19],"v0_walk_0":[6,24],"v0_walk_1":[6,24],"v0_provoke":[8,24],"v0_soft":[8,23],"v0_carry_0":[10,24],"v0_carry_1":[6,24],"v1_walk_0":[6,24],"v1_walk_1":[6,24],"v1_provoke":[6,24],"v1_soft":[8,23],"v1_carry_0":[10,24],"v1_carry_1":[6,24],"v2_walk_0":[6,24],"v2_walk_1":[6,24],"v2_provoke":[8,25],"v2_soft":[8,23],"v2_carry_0":[10,24],"v2_carry_1":[6,24],"v3_walk_0":[8,24],"v3_walk_1":[8,24],"v3_provoke":[10,24],"v3_soft":[10,23],"v3_carry_0":[12,24],"v3_carry_1":[8,25],"v4_walk_0":[6,24],"v4_walk_1":[6,24],"v4_provoke":[8,24],"v4_soft":[8,23],"v4_carry_0":[10,24],"v4_carry_1":[6,24],"v5_walk_0":[6,24],"v5_walk_1":[6,24],"v5_provoke":[8,24],"v5_soft":[8,23],"v5_carry_0":[10,24],"v5_carry_1":[6,24]},"bg":["d9869f0010f917831b4bea628e0b2210"],"geo":{"crop":"centre","tent":[10,58,96,132],"tentMouth":[64,118],"clearing":[0,100,192,160],"bankEdge":162,"river":{"band":[164,256],"lanes":[172,196,220]},"stone":[140,224],"stoneBox":[124,216,156,232],"forest":[0,0,192,58],"nearBank":[0,258,192,320],"paintedLamp":[184,138]}};
/* MINI_ART:END */
/* GAME:hemlock:BEGIN */
(function(){
/* Seventy Years (Socrates, short). Helper: mPath. Art key socrates_s. */
{
const K="socrates_s",GO="#F5C66A",PI=Math.PI,LM=["house","lyre","shield","lampstand","scales"],
PT=[[36,236],[36,206],[100,196],[150,170],[104,146],[60,122],[84,110],[62,98],[88,86],[100,62]],BR=[[2,160,226],[3,184,140],[8,26,86]];
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("hemlock_tie",()=>aTone(AN(10),.6,{type:"triangle",v:.05,a:.004,lp:2400,to:AN(9)}));
V("hemlock_taut",()=>{aNoise(.7,{f:200,to:320,q:5,v:.05,a:.2});aTone(AN(-26),.7,{type:"sawtooth",v:.02,lp:260,to:AN(-23),a:.2})});
V("hemlock_verdict",()=>aTone(AN(-19),1,{v:.06,lp:500,a:.08}));
V("hemlock_stele",()=>[0,4,7,12].forEach((n,i)=>aTone(AN(n),1.2,{v:.03,a:.05,at:i*.05})));
const mk=(v,w)=>mPath({pts:PT.map((p,i)=>i>5?[p[0]+w,p[1]]:p),tol:v?8:10,speed:70});
const nd=(P,x,y)=>{let m=1e9;for(const g of P.seg){const a=g.b[0]-g.a[0],b=g.b[1]-g.a[1],k=clamp(((x-g.a[0])*a+(y-g.a[1])*b)/(a*a+b*b),0,1);m=Math.min(m,Math.hypot(g.a[0]+a*k-x,g.a[1]+b*k-y))}return m};
const pp=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];return r&&v&&mPerson(c,K,n,x,y,Object.assign({ax:v[0]/r[2],ay:v[1]/r[3]},o))};
const back=c=>{if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#1A2246");g.addColorStop(1,"#2B2438");c.fillStyle=g;c.fillRect(0,0,192,320);c.fillStyle="#0B0812";c.fillRect(14,72,26,26)}};
const cloud=(c,a)=>{if(a>0){c.save();c.globalAlpha=a*.6;c.fillStyle="#6A6C7C";[[44,34,40],[96,26,46],[150,36,38]].forEach(q=>{c.beginPath();c.ellipse(q[0],q[1],q[2],11,0,0,7);c.fill()});c.restore()}};
const piece=(c,n,x,y,o,col)=>{if(!mPiece(c,K,n,x,y,o)){c.fillStyle=col||GO;c.fillRect(x-5,y-8,10,12)}};
const fig=(c,n,x,y)=>{if(!pp(c,n,x,y)){c.fillStyle="#100B15";c.fillRect(x-4,y-14,8,14);c.fillStyle="#C9B08A";c.fillRect(x-3,y-13,6,12)}};
MINI.hemlock={who:"socrates",land:"l2",title:"Seventy Years",short:true,art:K,stages:["Keep Faith"],
  setup:["Athens gave me everything: a home, a schooling, a city to argue in.","I could have left any year I liked. I stayed seventy years."],
  how:"Trace my path with your finger. Stay close to it.",win:"The gate was open the whole time. Staying was my promise, and I kept it.",walk:"Take the cup. Keep your promises, even the quiet ones.",
  lines:[null],pad:true,ab:false,bloomT:2,limit:90,
  fl:["You reached the Laws","A steady path","Every promise kept"],flNext:["Keep your finger on the path, even in the wind.","Walk past the open gate."],
  rate:s=>s.slips===0&&!s.crito?3:s.slips<=3?2:1,
  shotReady:s=>s.v&&s.T-s.vT>1.8,
  init(s){const A=MINI_ART[K],g=A&&A.geo&&A.geo.gate||[26,86];BR[2][1]=g[0];BR[2][2]=g[1];
    Object.assign(s,{st:0,stT:0,T:0,hd:0,th:[0,0,0,0,0],nt:0,slips:0,crito:0,v:0,vT:0,hold:0,ex:null,on:0,gt:-1,bd:1,hx:36,hy:236,fa:"up",mv:0,P:mk(0,0)})},
  step(s,dt,inp){s.stT+=dt;const T=s.T+=dt,tau=s.crito?.5:1,e=s.ex,f=inp.down;let P=s.P;
    if(s.gt>=0){s.gt+=dt;return s.gt>=1.3?"win":null}
    if(s.v){const o=P;P=s.P=mk(1,Math.min(1,(T-s.vT)/.8)*6*Math.sin(T*PI*.7));P.d=o.d;P.pen=o.pen;P.off=o.off}
    if(e){if(e.ph===0){e.d=Math.min(e.L,e.d+70*tau*dt);if(e.j===8&&e.d>12&&!s.crito){s.crito=1;sfx("hemlock_taut")}if(e.d>=e.L){e.ph=1;e.t=0}}
      else if(e.ph===1){if((e.t+=dt)>=1){e.ph=2;e.t=0;if(e.j===8)s.bd=.3}}
      else if((e.t+=dt)>=1.5){s.ex=null;s.on=0}
      const k=e.ph===2?1-e.t/1.5:e.ph?1:e.d/e.L,r=e.ph===2?-1:1;s.hx=e.x+e.ux*e.L*k;s.hy=e.y+e.uy*e.L*k;s.mv=e.ph!==1;s.fa=Math.abs(e.ux)>.5?e.ux*r>0?"right":"left":"up";return null}
    if(s.hold>0){s.hold-=dt;s.mv=0;return null}
    let bi=0;for(const b of BR){const j=b[0],J=P.pts[j];if(Math.abs(s.hd-P.seg[j].d0)>10)continue;
      const L=Math.hypot(b[1]-J[0],b[2]-J[1]),ux=(b[1]-J[0])/L,uy=(b[2]-J[1])/L;let go=0;
      if(f){const ax=f.x-J[0],ay=f.y-J[1],pe=Math.abs(ax*uy-ay*ux),na=ax*ux+ay*uy;if(na>0&&pe<=P.tol&&pe<nd(P,f.x,f.y)){bi=1;go=na>12}}
      else if(inp.dx||inp.dy){const m=Math.hypot(inp.dx,inp.dy),q=P.at(s.hd),u=(inp.dx*ux+inp.dy*uy)/m;go=u>.7&&u>(inp.dx*q.tx+inp.dy*q.ty)/m+.1}
      if(go){s.ex={j,x:J[0],y:J[1],ux,uy,L,d:0,ph:0,t:0};return null}}
    if(bi){s.mv=0;return null}
    P.step(dt,inp);P.d=Math.min(P.d,s.hd+20);
    if(f){if(P.off){if(s.on){s.slips++;s.on=0}}else s.on=1}else s.on=0;
    s.mv=!P.off&&P.d-s.hd>.3;if(!P.off)s.hd=Math.min(P.d,s.hd+70*tau*dt);
    const q=P.at(s.hd);s.hx=q.x;s.hy=q.y;s.fa=Math.abs(q.tx)>Math.abs(q.ty)?q.tx>0?"right":"left":"up";
    for(let i=1;i<6;i++)if(!s.th[i-1]&&s.hd>=P.seg[i].d0){s.th[i-1]=T;s.nt++;sfx("hemlock_tie")}
    if(!s.v&&s.hd>=P.seg[5].d0){s.v=1;s.vT=T;s.hold=1;sfx("hemlock_verdict")}
    if(s.hd>=P.len-.5){s.gt=0;sfx("hemlock_stele")}
    return null},
  draw(s,c,t){const T=s.T,P=s.P,cr=s.crito,fl=cr?s.rm?.7:.75+.25*Math.sin(T*55):1,gk=s.gt>=0?Math.min(1,s.gt/1.2):0,gp=PT[9];back(c);
    if(s.v){cloud(c,Math.min(1,(T-s.vT)/1));if(!s.rm){c.strokeStyle="rgba(220,215,235,.3)";for(let i=0;i<7;i++){const x=192-(T*70+i*41)%210;c.beginPath();c.moveTo(x,60+i*24);c.lineTo(x+9,60+i*24);c.stroke()}}}
    P.drawGuide(c,"rgba(255,233,184,.35)");const d=P.d;P.d=s.hd;P.drawDone(c,GO);P.d=d;
    c.save();c.setLineDash([2,3]);for(const b of BR){const J=P.pts[b[0]],w=b[0]===8;if(w&&!s.v)continue;c.strokeStyle=w?"rgba(255,190,110,"+.6*s.bd+")":"rgba(255,233,184,.25)";c.beginPath();c.moveTo(J[0],J[1]);c.lineTo(b[1],b[2]);c.stroke();
      if(w)glow(c,b[1],b[2],14+2*Math.sin(T*3),"#FFB347",.4*s.bd);else piece(c,"gate",b[1],b[2]+2,{ax:.5,ay:1,a:.8},"#6A5A70")}c.restore();
    LM.forEach((n,i)=>{const p=PT[i+1],lit=s.th[i];if(lit)glow(c,p[0],p[1]-10,14,GO,.3*fl);piece(c,n,p[0],p[1]-10,{ax:.5,ay:.5,a:lit?fl:.5,rot:i===4&&s.v?.3*Math.min(1,(T-s.vT)/.6):0},lit?GO:"#6A6070")});
    piece(c,"stele",gp[0]+14,gp[1]+4,{ax:.5,ay:1},"#C8BEB0");if(gk)glow(c,gp[0]+14,gp[1]-16,26,GO,.6*gk);
    const hx=s.hx,hy=s.hy,tx=lerp(hx,gp[0]+14,gk),ty=lerp(hy-14,gp[1]-14,gk);
    s.th.forEach((u,i)=>{if(u){const p=PT[i+1];rope(c,p[0],p[1]-18,tx,ty,cr?0:10*(1-gk),"rgba(245,198,106,"+(cr&&!gk?.4:.9)+")",1)}});
    mShadow(c,hx,hy,10,.4);fig(c,s.mv?"soc_walk_"+s.fa+"_"+(Math.floor(T*6)%2):"soc_idle_0",hx,hy);
    if(s.P.off&&!s.ex){c.save();c.strokeStyle=GO;c.setLineDash([2,2]);c.beginPath();c.arc(hx,hy-8,11,0,7);c.stroke();c.restore()}},
  bloom(s,c,k,t){const e=E.out(clamp(k/.6,0,1)),fl=s._fl||1,g=clamp((k-.2)/.6,0,1),f=clamp((k-.3)/.4,0,1),tk=s.rm?0:Math.floor(t/380)%2;back(c);gradeN(c,"dawn",.5*e);cloud(c,1-e);
    glow(c,10-24*k,84,9,"#FFE3A0",.5*(1-g));c.save();c.beginPath();c.moveTo(14,98);c.lineTo(14,85);c.arc(27,85,13,PI,0);c.lineTo(40,98);c.clip();c.fillStyle="#4A3626";c.fillRect(14,72,13*g,26);c.fillRect(40-13*g,72,13*g,26);c.fillStyle="#100B15";c.fillRect(26.5,72,1,26*g);c.restore();
    c.fillStyle="#B8AE9E";c.fillRect(62,92,106,6);piece(c,"stele",140,92,{ax:.5,ay:1},"#C8BEB0");glow(c,140,76,26,GO,.35);
    fig(c,"soc_sit",96,92);c.globalAlpha=f;fig(c,"friend0_talk_"+tk,76,92);fig(c,"friend1_talk_"+(1-tk),116,92);c.globalAlpha=1;
    for(let i=0;i<5;i++){rope(c,58,64-i*5,134,64-i*5,-6,"rgba(255,226,150,"+(.3+.2*fl)*e+")",1);}glow(c,96,52,40,GO,(.1+.1*fl)*e)},
  auto(s,inp){if(s.gt>=0||s.ex)return;const dt=s.T-(s.aT==null?s.T:s.aT);s.aT=s.T;s.ad=Math.min((s.ad||0)+50*dt,s.hd+12);const q=s.P.at(s.ad);inp.down={x:q.x,y:q.y}}
};
}
})();
/* GAME:hemlock:END */
/* GAME:cloak:BEGIN */
(function(){
/* What Holds It Up? (Socrates, short). Helper: mDrag (touch only). Art socrates_s. */
{
const K="socrates_s",GO="#F5C66A",PI=Math.PI,X=[51,81,111,141],Y=[144,120,96],LY=[98,74],TR="scales shield lyre hands lampstand bowl",
R=["scales coins robe hands lyre sandals mirror bowl","ring shield scales coins laurel hands lampstand robe mirror lyre bowl sandals"].map(r=>r.split(" "));
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("cloak_why",()=>{aTone(AN(7),.2,{v:.04,type:"triangle"});aTone(AN(14),.35,{v:.04,type:"triangle",at:.1})});
V("cloak_hollow",()=>{aNoise(.35,{f:5200,q:3,v:.03,a:.02})});
V("cloak_creak",()=>{aTone(AN(-24),.5,{type:"sawtooth",v:.02,lp:300,to:AN(-21),a:.12});aNoise(.4,{f:160,q:5,v:.04})});
V("cloak_build",()=>{aTone(AN(-17),.12,{v:.06,lp:400,to:AN(-24)});aNoise(.08,{f:300,q:1,v:.04})});
GAP.cloak_build=.1;
const pp=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];return r&&v&&mPerson(c,K,n,x,y,Object.assign({ax:v[0]/r[2],ay:v[1]/r[3]},o))};
const fig=(c,n,x,y,col,o)=>{if(!pp(c,n,x,y,o)){c.fillStyle=col||"#C9B08A";c.fillRect(x-4,y-14,8,14)}};
const back=c=>{if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#3A2F4A");g.addColorStop(1,"#C98C6A");c.fillStyle=g;c.fillRect(0,0,192,320)}gradeN(c,"dawn",.5);
  c.fillStyle="#100B15";c.fillRect(28,156,136,14);c.fillStyle="#BDB4A4";c.fillRect(29,157,134,12);c.fillStyle="#D4CCBC";c.fillRect(29,157,134,3)};
const blk=(c,n,x,y,o)=>{o=o||{};c.save();c.globalAlpha*=o.a==null?1:o.a;c.translate(x,y);if(o.rot)c.rotate(o.rot);
  c.fillStyle="#100B15";c.fillRect(-15,-12,30,24);c.fillStyle=o.gl?"#E6C25E":"#DDD6C8";c.fillRect(-14,-11,28,22);c.fillStyle=o.gl?"#F7E3A0":"#EFE9DD";c.fillRect(-14,-11,28,2);c.fillStyle=o.gl?"#B8913A":"#BDB4A4";c.fillRect(-14,9,28,2);
  if(o.gl){c.fillStyle="#DDD6C8";c.fillRect(-10,-7,20,14)}
  if(!mPiece(c,K,n,0,0,{ax:.5,ay:.5})){c.fillStyle="#7A6A8A";c.fillRect(-5,-5,10,10)}c.restore()};
const lin=(c,y,a)=>{c.save();c.globalAlpha*=a;c.fillStyle="#100B15";c.fillRect(36,y-10,120,20);c.fillStyle="#D4CCBC";c.fillRect(37,y-9,118,18);c.fillStyle="#6F8F52";for(let i=0;i<14;i++){c.beginPath();c.ellipse(44+i*8.4,y,3,1.6,i%2?.5:-.5,0,7);c.fill()}c.restore()};
const build=(s,rd)=>{s.rd=rd;s.bl=R[rd].map((n,i)=>({n,t:TR.includes(n),c:i%4,r:i>>2,x:X[i%4],y:Y[i>>2],x0:X[i%4],y0:Y[i>>2],w:30,h:24,asked:0,aT:9,rv:0,ld:0,wob:0,dir:1,gl:rd&&(n==="shield"||n==="hands")?1:0}));
  s.cu=s.bl[0];if(s.D)s.D.pieces=s.bl};
const near=(s,x,y)=>s.bl.reduce((m,b)=>!m||Math.hypot(b.x0-x,b.y0-y)<Math.hypot(m.x0-x,m.y0-y)?b:m,null);
const ask=(s,b)=>{if(b&&!b.gone){b.asked=1;b.aT=0;sfx("cloak_why")}};
function pull(s,b,dir){if(s.ph||!b||b.gone)return;
  if(b.t){s.wob++;b.wob=.62;b.dir=dir;sfx("cloak_creak");return}
  if(!b.asked)s.unasked++;b.gone=1;s.bl=s.bl.filter(q=>q!==b);s.D.pieces=s.bl;s.fx.push({n:b.n,x:b.x0,y:b.y0,dir,t:0});sfx("cloak_hollow");
  for(let i=0;i<12;i++)pAdd(s.P,{x:b.x0+Math.random()*20-10,y:b.y0+Math.random()*16-8,vx:dir*(20+Math.random()*30),vy:-10-Math.random()*20,g:50,drag:.96,life:.8+Math.random()*.6,col:"#E6C25E",s:1.5});
  s.cu=near(s,b.x0,b.y0);if(!s.bl.some(q=>!q.t)){s.ph=s.rd?3:1;s.pt=0}}
MINI.cloak={who:"socrates",land:"l2",title:"What Holds It Up?",short:true,art:K,stages:["Ask Why"],
  setup:["Someone built this to show what a good life rests on.","Let’s ask each piece why it’s there, and see what really holds it up."],
  how:"Tap a block to ask why. Slide out whatever holds nothing up.",win:"Gold, fine clothes, a mirror. Out they came, and the good life still stands.",walk:"Keep the cloak. It’s kept me warm for years without anyone admiring it.",
  lines:[null],pad:true,ab:true,bloomT:2.2,limit:90,
  fl:["The plain arch stands","A careful questioner","Asked before every move"],flNext:["Ask a block why before you pull it.","Ask first, every time."],
  rate:s=>s.wob===0&&s.unasked===0?3:s.wob<=2?2:1,
  shotReady:s=>s.rd&&!s.ph&&s.bl.filter(b=>!b.t).length===4&&s.bl.some(b=>b.asked&&!b.t&&b.aT>.65),
  init(s){Object.assign(s,{st:0,stT:0,T:0,ph:0,pt:0,wob:0,unasked:0,fx:[],P:pfx(),kb:0,au:null,was:0,dn:null,pl:0,mx:0,p0:null,D:null});
    s.D=mDrag({pieces:[],spots:[{id:0,x:14,y:140,r:16},{id:1,x:178,y:140,r:16}],snap:false});build(s,0)},
  step(s,dt,inp){s.stT+=dt;const T=s.T+=dt,f=inp.down;pStep(s.P,dt,s.rm);s.fx=s.fx.filter(q=>(q.t+=dt)<.6);
    for(const b of s.bl){b.aT+=dt;if(b.wob>0)b.wob=Math.max(0,b.wob-dt);if(b.asked&&!b.rv&&b.aT>=.6){b.rv=1;if(!b.t)sfx("cloak_hollow")}
      if(b.asked&&!b.t&&b.rv&&Math.random()<dt*(s.rm?1:4))pAdd(s.P,{x:b.x0+Math.random()*20-10,y:b.y0+9,vx:Math.random()-.5,vy:12,life:.9,col:"#E6C25E",s:1})}
    if(s.ph){s.pt+=dt;if(s.ph===3)return s.pt>=.8?"win":null;
      if(s.ph===1&&s.pt>=1){s.ph=2;s.pt=0}
      else if(s.ph===2){if(s.pt>=1&&s.rd===0)build(s,1);if(s.rd===1)for(const b of s.bl)if(!b.ld&&s.pt>=1.5+b.r*.3+b.c*.08){b.ld=1;sfx("cloak_build")}if(s.pt>=2.8)s.ph=0}
      s.was=!!f;return null}
    const ki=Object.assign({},inp,{dx:0,dy:0,aTap:false}),mx=(inp.rTap?1:0)-(inp.lTap?1:0),my=(inp.dTap?1:0)-(inp.uTap?1:0),D=s.D;
    D.step(dt,ki);
    if(mx||my){s.kb=1;let best=null,bs=1e9;for(const b of s.bl){const dx=b.x0-s.cu.x0,dy=b.y0-s.cu.y0,a=dx*mx+dy*my,sc=a+2*Math.abs(dx*my-dy*mx);if(a>0&&sc<bs){bs=sc;best=b}}if(best)s.cu=best}
    if(inp.aTap){s.kb=1;ask(s,s.cu)}
    if(inp.bTap){s.kb=1;pull(s,s.cu,s.cu.x0<96?-1:1)}
    if(f&&!s.was){s.dn=D.held;s.p0={x:f.x,y:f.y};s.mx=0;s.pl=0}
    if(f&&s.p0)s.mx=Math.max(s.mx,Math.hypot(f.x-s.p0.x,f.y-s.p0.y));
    const h=D.held;if(f&&h&&Math.abs(h.x-h.x0)>=22){D.held=null;D.touch=false;const d=h.x>h.x0?1:-1;h.x=h.x0;h.y=h.y0;s.pl=1;pull(s,h,d)}
    if(!f&&s.was){if(s.dn&&!s.pl&&s.mx<8)ask(s,s.dn);s.dn=null}
    s.was=!!f;return null},
  draw(s,c,t){back(c);const rm=s.rm,pt=s.pt,nw=s.ph===2&&s.rd===1,old=s.ph===2&&s.rd===0,oa=old?clamp(1-(pt-.8)/.2,0,1):1,D=s.D;
    if(D.held)for(const q of D.spots){c.strokeStyle=q===D.over?GO:"rgba(255,233,184,.35)";c.setLineDash([2,2]);c.beginPath();c.arc(q.x,q.y,q.r,0,7);c.stroke();c.setLineDash([])}
    const fo=(r,col)=>{const k=clamp((pt-1-r*.3-col*.08)/.5,0,1);return nw?[rm?0:-(1-k*k)*160,rm?k:1]:[0,1]};
    const lo=nw?fo(3,0):[0,oa];lin(c,LY[s.rd]+lo[0],lo[1]);
    const wb=s.bl.filter(b=>b.wob>0);
    for(const b of s.bl){const [dy,a]=nw?fo(b.r,b.c):[0,oa];let x=b.x,y=b.y+dy,rot=0,k=0;
      if(b.t){x=b.x0+clamp(b.x-b.x0,-6,6);if(b.wob>0){const u=b.wob>.5?(.62-b.wob)/.12:b.wob/.5;x+=6*b.dir*u}}
      for(const w of wb)if(w.c===b.c&&w.r<b.r)rot+=.0524*w.dir*Math.sin(PI*(1-w.wob/.62));
      if(b.asked&&!b.t&&b.aT>=.6){x+=rm?0:Math.sin(t/30)*.6}
      blk(c,b.n,x,y,{a,gl:b.gl,rot});
      if(b.asked){const q=b.aT;
        if(q<.6){c.strokeStyle=GO;c.globalAlpha=1-q/.6;c.lineWidth=1.5;c.beginPath();c.arc(x,y,6+q/.6*(rm?0:12),0,7);c.stroke();c.globalAlpha=1;c.lineWidth=1;mText(c,"?",x,y-1,8,"#FFE9B8")}
        else if(b.t){glow(c,x,y,22,GO,.3);c.strokeStyle=GO;c.lineWidth=1.5;c.strokeRect(x-14.5,y-11.5,29,23);c.lineWidth=1;
          const car=s.bl.filter(o=>o.c===b.c&&o.r>b.r).map(o=>o.y0).concat(LY[s.rd]),p=clamp((q-.6)/.8,0,1);c.strokeStyle="rgba(255,226,150,.9)";
          car.forEach((yy,i)=>{const lx=b.x0+(i-(car.length-1)/2)*4;c.beginPath();c.moveTo(lx,yy);c.lineTo(lx,yy+(156-yy)*p);c.stroke()})}
        else{c.fillStyle="#100B15";c.fillRect(x-15,y-13,30,1);c.fillRect(x-15,y+12,30,1);c.strokeStyle=GO;c.setLineDash([2,2]);c.strokeRect(x-14.5,y-11.5,29,23);c.setLineDash([])}}}
    for(const q of s.fx){const k=q.t/.6;c.globalAlpha=1-k;blk(c,q.n,q.x+q.dir*22*E.out(k),q.y+k*6);c.globalAlpha=1}
    pDraw(c,s.P,K);
    if(s.kb&&s.ph===0&&s.cu){c.strokeStyle=GO;c.lineWidth=1;c.strokeRect(s.cu.x0-17.5,s.cu.y0-13.5,35,27)}
    if(s.ph===2)fig(c,pt>=.9&&pt<1.5?"rich_place":"rich_walk_"+(rm?0:Math.floor(t/150)%2),pt<1.5?lerp(215,170,clamp(pt/.9,0,1)):170+(pt-1.5)*60,176,"#A070C0",{flip:pt<1.5})},
  bloom(s,c,k,t){const n=(s._fl||1)+1,e=E.out(clamp(k/.4,0,1)),w=E.inOut(clamp((k-.1)/.45,0,1)),tk=s.rm?0:Math.floor(t/420);back(c);lin(c,74,1);
    [[62,1],[130,2]].forEach(([x,col])=>{for(let r=0;r<3;r++)blk(c,R[1][r*4+col],x,Y[r],{gl:R[1][r*4+col]==="shield"||R[1][r*4+col]==="hands"})});
    mPiece(c,K,"cloak",156,86,{ax:.5,ay:0})||(c.fillStyle="#7A5E3C",c.fillRect(150,86,12,22));
    c.fillStyle="#E6C25E";for(let i=0;i<24;i++){const u=k*(120+i%5*30),x=X[i%4]+u*.9,y=Y[i%3]-u*.25-(i%7)*2;c.globalAlpha=Math.max(0,1-k*1.4);c.fillRect(hs(x),hs(y),1.5,1.5)}c.globalAlpha=1;
    glow(c,96,120,50,"#FFE3A0",.15*e);
    if(k<.6)fig(c,"soc_walk_right_"+(s.rm?0:Math.floor(t/150)%2),lerp(-10,96,w),158);else fig(c,"soc_sit",96,156);
    for(let i=0;i<n;i++){c.globalAlpha=clamp((k-.55-i*.07)/.15,0,1);fig(c,"youth"+i+"_talk_"+((tk+i)%2),[76,116,56,136][i],156);c.globalAlpha=1}},
  auto(s,inp){if(s.ph)return;const b=s.bl.find(q=>!q.t);if(!b)return;const a=s.au||(s.au={b:null,t:0});if(a.b!==b){a.b=b;a.t=s.T}const t=s.T-a.t,d=b.x0<96?-1:1;
    if(t>=.1&&t<.2)inp.down={x:b.x0,y:b.y0};else if(t>=.9)inp.down={x:b.x0+d*clamp((t-.9)*100,0,30),y:b.y0}}
};
}
})();
/* GAME:cloak:END */
/* GAME:waxtablet:BEGIN */
(function(){
/* Practice Shots (waxtablet). Aristotle, "A Tutor’s Wax Tablet". Helper: none (own input, custom sway; uses glow, gradeN, pfx). Every shot, hit or miss, shrinks the sway. */
{
const K="aristotle_s",TX=96,TY=104,FL=.35,HX=32,HY=26;
const amp=n=>Math.max(2,16*Math.pow(.82,n)),pos=(s,t)=>{const a=amp(s.shots);return[TX+a*Math.sin(1.7*t),TY+.6*a*Math.sin(2.3*t+1.1)]};
if(typeof SFX!=="undefined"&&!SFX.wax_loose){ /* four soft voices; each has its visual cue (arrow flies, thunk ring, gold flash, dot on the tablet) */
  SFX.wax_loose=()=>{aTone(AN(3),.16,{type:"triangle",v:.05,lp:1500,to:AN(-4)});aNoise(.05,{f:2600,q:1,v:.025})};
  SFX.wax_thunk=()=>{aNoise(.09,{f:240,q:.7,v:.1,a:.004});aTone(AN(-19),.1,{type:"triangle",v:.06})};
  SFX.wax_gold=()=>{aTone(AN(24),.13,{v:.04});aTone(AN(31),.12,{v:.03,at:.05})};
  SFX.wax_press=()=>aNoise(.07,{type:"lowpass",f:500,q:.5,v:.05,a:.012});
  GAP.wax_gold=.1;GAP.wax_press=.08}
function pp(c,n,x,y,fl,col){const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];
  if(r&&v&&mPerson(c,K,n,x,y,{ax:v[0]/r[2],ay:1,flip:fl}))return;c.fillStyle=col;c.fillRect(x-5,y-16,10,16);c.fillStyle="#E2BE98";c.fillRect(x-3,y-21,6,5)}
function ring4(c,x,y,r,w,col){c.beginPath();c.arc(x,y,r,0,7);c.strokeStyle=col;c.lineWidth=w;c.stroke()}
function tab(c,s,cx,cy,sc,cl,da,gl,xs){ /* the tablet with its small target; each landing is a dot (cl pulls the dots together; xs: the stylus has smoothed everything left of xs) */
  const u=sc/1.7,ds=.6*u;if(gl>0)glow(c,cx,cy,30*u,"#FFD890",gl*.5);
  if(!mPiece(c,K,"tablet",cx,cy,{ax:.5,ay:.5,sc,sm:sc!==3})){c.fillStyle="#6A4A30";c.fillRect(cx-14*sc,cy-10*sc,28*sc,20*sc);c.fillStyle="#2A2420";c.fillRect(cx-12*sc,cy-8*sc,24*sc,16*sc)}
  c.save();[20,15,10,5].forEach(r=>ring4(c,cx,cy,r*ds,.5,r>5?"rgba(233,223,200,.4)":"rgba(245,198,106,.7)"));
  for(const d of s.dots){const x=cx+d.x*ds*cl,y=cy+d.y*ds*cl;c.globalAlpha=xs!=null&&x<xs?.15:da;
    if(d.g){glow(c,x,y,4*u,"#FFD890",(gl||.2)*.5);c.fillStyle="#F5C66A";c.beginPath();c.arc(x,y,1.5*u,0,7);c.fill()}else{c.fillStyle="#D8CDB8";c.fillRect(x-.7*u,y-.7*u,1.4*u,1.4*u)}}
  c.restore()}
function scene(s,c,t,bk){const bl=bk!=null,fl=s._fl||1,e=bl?E.inOut(Math.min(1,bk/.3)):0;
  if(!mBg(c,K,0)){c.fillStyle="#2E4A34";c.fillRect(0,0,192,320);c.fillStyle="#9A8A6A";c.fillRect(86,52,20,218);c.fillStyle="#6A4A38";c.fillRect(0,0,192,50);c.fillStyle="#1E2E26";c.fillRect(0,262,192,58)}
  if(!mPiece(c,K,"target",TX,TY,{ax:.5,ay:.5}))[[20,"#E9DFC8"],[15,"#3A5E9A"],[10,"#B8403A"],[5,"#F5C66A"]].forEach(a=>{c.fillStyle=a[1];c.beginPath();c.arc(TX,TY,a[0],0,7);c.fill()});
  ring4(c,TX,TY,5,.7,"rgba(245,198,106,.9)");
  for(const a of s.ar){const al=a.f==null?1:1-a.f/.6;
    if(a.t<FL){const u=a.t/FL,x=lerp(96,a.x,u),y=lerp(210,a.y,u),th=Math.atan2(a.y-210,a.x-96),sc=lerp(1,.8,u);
      if(!mPiece(c,K,"arrow",x,y,{ax:.5,ay:.5,rot:th+Math.PI/4,sc})){c.strokeStyle="#C9A06A";c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x-4*Math.cos(th),y-4*Math.sin(th));c.stroke()}}
    else if(!mPiece(c,K,"arrow",a.x,a.y,{ax:.95,ay:.08,a:al})){c.save();c.globalAlpha=al;c.strokeStyle="#C9A06A";c.lineWidth=1;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(a.x-6,a.y+8);c.stroke();c.restore()}
    const k=(a.t-FL)/.45;if(k>0&&k<1&&a.g){const r=s.rm?9:3+11*E.out(k);ring4(c,a.x,a.y,r,1.3,`rgba(255,226,150,${.9*(1-k)})`)}}
  const pr=bl?bk>.25?"stu_idle":"stu_draw":s.ck<.5?"stu_idle":s.lt>0?"stu_loose":"stu_draw",ar=bl?"ari_smooth":s.wr>0?"ari_write":"ari_tab_"+(s.rm?0:Math.floor(t/700)&1);
  const sx=lerp(96,126,e),sy=lerp(228,150,e),ax=lerp(40,70,e),ay=lerp(214,150,e);
  mShadow(c,sx,sy,14,.35);pp(c,pr,sx,sy,0,"#8A7A5A");mShadow(c,ax,ay,14,.35);pp(c,ar,ax,ay,0,"#9A8A6A");
  if(!bl){if(s.gold<5){const x=s.sx,y=s.sy;c.save();for(const[col,w]of[["rgba(16,11,21,.85)",2.2],["#FFE9B8",.9]]){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.arc(x,y,4,0,7);c.moveTo(x-6,y);c.lineTo(x+6,y);c.moveTo(x,y-6);c.lineTo(x,y+6);c.stroke()}c.restore()}
    tab(c,s,HX,HY,1.7,1,1,0);const g=s.dots.filter(d=>d.g).length;
    for(let i=0;i<5;i++){c.fillStyle=i<g?"#F5C66A":"rgba(16,11,21,.6)";c.beginPath();c.moveTo(14+9*i,47);c.lineTo(18+9*i,51);c.lineTo(14+9*i,55);c.lineTo(10+9*i,51);c.fill()}
    pDraw(c,s.P,K);return}
  grade(c,"#0A0610",.5*e);const cx=lerp(HX,96,e),cy=lerp(HY,86,e),sc=lerp(1.7,3,e),h=clamp((bk-.3)/.3,0,1),w=clamp((bk-.62)/.3,0,1),xs=cx-14*sc+28*sc*w;
  tab(c,s,cx,cy,sc,lerp(1,.22,E.out(h)),1,(.3+.2*fl)*(1-.4*w),w>0?xs:null);
  if(w>0&&w<1){c.save();c.fillStyle="rgba(240,226,190,.55)";c.fillRect(xs-1,cy-10*sc,2,20*sc);c.restore()}
  if(!s.rm)for(let i=0;i<4+fl*2;i++)if(bk>.3&&bk<.8)glow(c,cx+Math.sin(i*5+bk*4)*12,cy+Math.cos(i*3)*8,4,"#FFE3A0",.3)}
MINI.waxtablet={who:"aristotle",land:"l2",title:"Practice Shots",short:true,art:K,stages:["The Practice Range"],amp,pos,
  setup:["No one is born an archer. Or brave, or fair, for that matter.","We become these things by doing them, over and over."],
  how:"Tap when the sight crosses the gold. Every shot counts.",win:"Look how the marks gather. Practice did that, not luck.",
  walk:"Keep the tablet. Smooth the wax and practice again tomorrow.",lines:[null],pad:false,ab:true,bloomT:2,limit:90,
  fl:["Five in the gold","A steady eye","A practiced archer"],flNext:["Wait for the sight to cross the center.","Watch where the sight slows near the middle."],
  rate:s=>{const n=s.at5||s.shots;return n<=9?3:n<=12?2:1},
  shotReady:s=>s.gold>=3&&s.dots.length>=3,
  init(s){s.st=0;s.stT=0;Object.assign(s,{ck:0,since:9,lt:0,wr:0,shots:0,gold:0,at5:0,ar:[],dots:[],P:pfx()});s.sx=pos(s,0)[0];s.sy=pos(s,0)[1]},
  step(s,dt,inp){s.ck+=dt;s.since+=dt;s.lt=Math.max(0,s.lt-dt);s.wr=Math.max(0,s.wr-dt);pStep(s.P,dt,s.rm);const p=pos(s,s.ck);s.sx=p[0];s.sy=p[1];
    if(s.gold<5&&((inp.taps&&inp.taps.length)||inp.aTap)){const g=Math.hypot(p[0]-TX,p[1]-TY)<=5; /* the sight point at release, no other randomness; n counts every shot */
      s.ar.push({x:p[0],y:p[1],t:0,g,L:0,p:0});s.shots++;s.since=0;s.lt=.25;sfx("wax_loose");if(g&&++s.gold===5)s.at5=s.shots}
    for(const a of s.ar){a.t+=dt;if(a.f!=null)a.f+=dt;
      if(!a.L&&a.t>=FL){a.L=1;sfx("wax_thunk");if(a.g)sfx("wax_gold");a.g?pSparks(s.P,a.x,a.y,s.rm?0:9,"#FFD890",30):pDust(s.P,a.x,a.y,s.rm?0:4)}
      if(a.L&&!a.p&&a.t>=FL+.2){a.p=1;s.dots.push({x:a.x-TX,y:a.y-TY,g:a.g});sfx("wax_press");s.wr=.4}}
    let k=0;for(let i=s.ar.length-1;i>=0;i--)if(s.ar[i].f==null&&++k>8)s.ar[i].f=0; /* up to 8 arrows stay; older ones fade */
    s.ar=s.ar.filter(a=>a.f==null||a.f<.6);
    return s.gold>=5&&s.ar.every(a=>a.p)?"win":null},
  draw(s,c,t){scene(s,c,t,null)},
  bloom(s,c,k,t){scene(s,c,t,k)},
  auto(s,inp){if(s.gold<5&&s.since>.6&&Math.hypot(s.sx-TX,s.sy-TY)<=3)inp.aTap=true}
};
}
})();
/* GAME:waxtablet:END */
/* GAME:peripatos:BEGIN */
(function(){
/* The Covered Walk (peripatos). Aristotle, "A Walking-Path Marker". Helper: mFlow (the world: things scroll left at 14 u/s and never stop). Idea: look closely at living things, then ask what each is for. */
{
const K="aristotle_s",SPD=14,MK=["swallow","spider","bee","figtree"],PR=["nest","web","honeycomb","figs"],ZT={swallow:1,spider:1,bee:1,figtree:0,snail:0,frog:0,lizard:0},KS=Object.keys(ZT),
  SC={swallow:2,spider:2,bee:2,figtree:1.5,snail:2,frog:2,lizard:2,nest:2,web:1.5,honeycomb:2,figs:2},SX=[104,67,50,33,16],SL={},
  FB={swallow:["#3A5E9A","S"],spider:["#6A4A6A","P"],bee:["#D9A93A","B"],figtree:["#4F7E3E","F"],snail:["#9A7A5A","N"],frog:["#5C9A58","R"],lizard:["#8A7A3A","L"],nest:["#8A6A44","n"],web:["#D8D8E0","w"],honeycomb:["#E8A838","h"],figs:["#8A5A2A","f"]};
if(typeof SFX!=="undefined"&&!SFX.peri_ask){ /* chime (bubble opens), two warm notes (gold line), rustle (product appears) */
  SFX.peri_ask=()=>{aTone(AN(7),.18,{type:"triangle",v:.04});aTone(AN(14),.22,{type:"triangle",v:.035,at:.08})};
  SFX.peri_found=()=>{aTone(AN(0),.3,{type:"triangle",v:.05,lp:2400});aTone(AN(7),.4,{type:"triangle",v:.05,lp:2400,at:.12})};
  SFX.peri_make=()=>aNoise(.35,{f:1800,to:3200,q:.6,v:.04,a:.1})}
const rnd=s=>{s.sd=(s.sd*16807)%2147483647;return s.sd/2147483647};
function setq(s){s.ans=MK[s.q%4];s.sil=s.q<4;s.shape=s.sil?s.ans:PR[s.q-4];s.bt=0;s.snd=1}
function sp(s,k,x){const rm=s.F.list.reduce((m,o)=>Math.max(m,o.x),150);s.F.spawn({k,x:x==null?Math.max(198,rm+28):x,y:ZT[k]?70+10*rnd(s):150+80*rnd(s),ph:rnd(s)})}
function dp(s,o){if(!o.mv)return[o.x,o.y];const f=E.inOut(clamp(o.mv.t/.8,0,1));return[lerp(o.x,o.mv.x-s.off,f),lerp(o.y,o.mv.y,f)-7*Math.sin(Math.PI*f)]}
function make(s,b){const col=Math.round((b.x+s.off-24)/48)*48+24;sfx("peri_make"); /* the maker makes its product */
  if(b.k==="swallow"){b.mv={t:0,x:col+12,y:60};s.pr.push({k:"nest",x:col,y:68,t:-.8})}
  else if(b.k==="spider"){b.mv={t:0,x:col+24,y:88};s.pr.push({k:"web",x:col+24,y:92,t:-.8})}
  else if(b.k==="bee")s.pr.push({k:"honeycomb",x:166,y:106,t:-.3,st:1});else b.fg=1}
function hit(s,x,y){if(s.fd>0)return;let b=null,bd=1e9;for(const o of s.F.list){const p=dp(s,o),dx=Math.abs(p[0]-x),dy=Math.abs(p[1]-y);if(dx<=12&&dy<=12&&dx+dy<bd){b=o;bd=dx+dy}}
  if(!b)return;if(b.k!==s.ans){b.wr=.6;s.wrong++;return} /* a wrong tap: its ring, s.wrong, nothing else */
  s.fd=1.5;s.fo=b;sfx("peri_found");if(s.sg.length<5)s.sg.push({i:s.sg.length,x:-14});if(!s.sil)make(s,b)}
function silo(k){if(SL[k])return SL[k];const A=MINI_ART[K],r=A&&A.rects&&A.rects[k],e=A&&mImgE(A.atlas);if(!r||!e||!e.ok)return null;
  const w=Math.round(r[2]*SC[k])+4,h=Math.round(r[3]*SC[k])+4,a=document.createElement("canvas"),b=document.createElement("canvas");a.width=b.width=w;a.height=b.height=h;
  const x=a.getContext("2d"),y=b.getContext("2d");x.drawImage(e.img,r[0],r[1],r[2],r[3],2,2,w-4,h-4);x.globalCompositeOperation="source-in";x.fillStyle="#1F5A5A";x.fillRect(0,0,w,h);
  for(const d of[[1,0],[-1,0],[0,1],[0,-1]])y.drawImage(a,d[0],d[1]);y.globalCompositeOperation="source-in";y.fillStyle="#F5C66A";y.fillRect(0,0,w,h);y.globalCompositeOperation="source-over";y.drawImage(a,0,0);return SL[k]=b}
function drw(c,k,x,y,sil,al,sc){sc=sc||SC[k];if(sil){const cv=silo(k);if(cv){mCanvas(c,cv,x,y,{ax:.5,ay:.5});return}}
  else if(mPiece(c,K,k,x,y,{ax:.5,ay:.5,sc,sm:sc%1>0,a:al}))return;
  c.save();c.globalAlpha=al==null?1:al;c.fillStyle=sil?"#1F5A5A":FB[k][0];c.strokeStyle=sil?"#F5C66A":"#100B15";c.beginPath();c.ellipse(x,y,9,7,0,0,7);c.fill();c.stroke();if(!sil)mText(c,FB[k][1],x,y,8);c.restore()}
function pp(c,n,x,y,fl,col){const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];mShadow(c,x,y,14,.35);
  if(r&&v&&mPerson(c,K,n,x,y,{ax:v[0]/r[2],ay:1,flip:fl}))return;c.fillStyle=col;c.fillRect(x-5,y-16,10,16);c.fillStyle="#E2BE98";c.fillRect(x-3,y-21,6,5)}
function back(s,c,off){if(!mBg(c,K,0)){c.fillStyle="#2E4A34";c.fillRect(0,0,192,320);c.fillStyle="#9A8A6A";c.fillRect(86,52,20,218);c.fillStyle="#6A4A38";c.fillRect(0,0,192,50)}
  gradeN(c,"dusk",.4);for(let i=-1;i<5;i++){const x=24+48*i-off%48;if(!mPiece(c,K,"column",x,140,{ax:.5,ay:1})){c.fillStyle="#D8D2C8";c.fillRect(x-8,70,16,70)}}}
function bub(c,s){const f=s.fd>0,e=E.back(Math.min(1,Math.max(0,s.bt)/.3));c.save();c.translate(128,104);c.scale(e,e);
  if(f)glow(c,0,0,30,"#FFD890",.5);c.fillStyle=f?"#F5C66A":"#EFE2C0";c.strokeStyle="#100B15";c.lineWidth=1.2;c.beginPath();c.rect(-16,-16,32,32);c.moveTo(-16,8);c.lineTo(-22,14);c.lineTo(-10,16);c.fill();c.stroke();
  drw(c,s.shape,0,0,s.sil);c.restore();mText(c,s.sil?"What is it?":"What is it for?",128,83,8)}
function walkers(s,c,t,k){const fr=s.rm?0:Math.floor(t/220)&1,e=k==null?0:E.inOut(clamp(k/.3,0,1)),sit=k!=null&&e>=1,pt=s.fd>0&&s.fo&&!k;
  if(sit)pp(c,"ari_sit",96,134,0,"#9A8A6A");else if(pt)pp(c,"ari_point",84,136,s.fo.x<84,"#9A8A6A");else pp(c,"ari_walk_"+fr,lerp(84,96,e),lerp(136,134,e),0,"#9A8A6A");
  s.sg.forEach((g,i)=>{const n="stud"+i+(sit?"_sit":"_walk_"+((fr+i)&1));pp(c,n,lerp(g.x,[70,122,56,136,84][i],e),lerp(136,[138,138,146,146,148][i],e),0,"#6A7A9A")})}
MINI.peripatos={who:"aristotle",land:"l2",title:"The Covered Walk",short:true,art:K,stages:["Walk and Look"],
  setup:["Walk with me. I think better on my feet.","Look closely at what lives here. It will answer most of your questions."],
  how:"When a student asks, tap the thing they mean.",win:"Once you see what a thing is for, it starts to make sense.",
  walk:"Keep the marker. Walk the path again, and look harder.",lines:[null],pad:true,ab:true,bloomT:2,limit:90,
  fl:["The lesson is done","A sharp eye","Nothing missed on the walk"],flNext:["Match the shape in the bubble before you tap.","In the second half, find who makes the thing."],
  rate:s=>s.wrong<=0?3:s.wrong<=3?2:1,
  shotReady:s=>s.q>=5&&s.fd>.6,
  release(){for(const k in SL)delete SL[k]},
  init(s){s.st=0;s.stT=0;s.sd=s.seed||(Math.random()*1e9|0)+1;Object.assign(s,{q:0,wrong:0,fd:0,fo:null,off:0,pr:[],sg:[{i:0,x:SX[0]}],cur:null,cu:0,pm:0});
    s.F=mFlow({dir:[-1,0],speed:SPD,bounds:[-20,-20,500,400]});setq(s);[184,138,92,46].forEach((x,i)=>sp(s,i===1?"swallow":i?KS[Math.floor(rnd(s)*7)]:"frog",x))},
  step(s,dt,inp){s.stT+=dt;s.off+=SPD*dt;s.bt+=dt;if(s.snd){s.snd=0;sfx("peri_ask")}s.F.step(dt);
    for(const o of s.F.list){if(o.wr>0)o.wr-=dt;if(o.mv)o.mv.t+=dt}
    for(const p of s.pr)p.t+=dt;s.pr=s.pr.filter(p=>p.st||p.x-s.off>-30);
    for(const g of s.sg)g.x=Math.min(SX[g.i],g.x+30*dt);
    const L=s.F.list;if(!L.some(o=>o.k===s.ans&&o.x>-10))sp(s,s.ans);else if(L.length<4&&L.reduce((m,o)=>Math.max(m,o.x),0)<=150)sp(s,KS[Math.floor(rnd(s)*7)]); /* a missed right thing re-enters at once; three or four things stay on screen */
    const V=L.filter(o=>o.x>0&&o.x<192).sort((a,b)=>a.x-b.x),m=inp.dx>.5?1:inp.dx<-.5?-1:0,d=inp.rTap?1:inp.lTap?-1:m&&m!==s.pm?m:0;s.pm=m;
    if(d||inp.aTap)s.cu=1;if(V.length&&(!s.cur||V.indexOf(s.cur)<0))s.cur=V[0];else if(d){const i=V.indexOf(s.cur);s.cur=V[(i+d+V.length)%V.length]}
    if(inp.aTap&&s.cur&&V.indexOf(s.cur)>=0)hit(s,s.cur.x,s.cur.y);else for(const tp of inp.taps||[]){hit(s,tp.x,tp.y);if(s.fd>0)break}
    if(s.fd>0){s.fd-=dt;if(s.fd<=0){if(s.q>=7)return"win";s.q++;setq(s)}}
    return null},
  draw(s,c,t){back(s,c,s.off);
    for(const p of s.pr)if(p.t>=0){const x=p.st?p.x:p.x-s.off;glow(c,x,p.y,16,"#FFD890",.5*Math.max(0,1-p.t/1.2));drw(c,p.k,x,p.y,0,Math.min(1,p.t/.4))}
    for(const o of s.F.list.slice().sort((a,b)=>a.y-b.y)){const q=dp(s,o),y=q[1]+(s.rm||!ZT[o.k]?0:Math.sin(t/300+o.ph*6));drw(c,o.k,q[0],y,0);
      if(o.fg)drw(c,"figs",q[0]+3,y+3,0,1,1);if(o.wr>0){c.save();c.strokeStyle="#100B15";for(const[w,col]of[[2.6,"#100B15"],[1.1,"#FFE9B8"]]){c.lineWidth=w;c.strokeStyle=col;c.globalAlpha=Math.min(1,o.wr/.3);c.beginPath();c.arc(q[0],y,13,0,7);c.stroke()}c.restore()}}
    walkers(s,c,t,null);
    if(s.fd>0&&s.fo){const q=dp(s,s.fo);c.save();c.strokeStyle="#F5C66A";c.lineWidth=1.2;c.beginPath();c.moveTo(q[0],q[1]);c.lineTo(128,104);c.stroke();c.restore();glow(c,q[0],q[1],16,"#FFD890",.4)}
    if(s.cu&&s.cur&&s.fd<=0){const q=dp(s,s.cur);c.save();c.setLineDash([3,2]);c.strokeStyle="#F5C66A";c.lineWidth=1;c.beginPath();c.rect(q[0]-12,q[1]-12,24,24);c.stroke();c.restore()}
    bub(c,s)},
  bloom(s,c,k,t){const fl=s._fl||1,e=E.inOut(clamp(k/.3,0,1));back(s,c,0);
    const A=[["nest",24,68],["web",96,92],["honeycomb",166,106],["figtree",156,138]];
    A.forEach((a,i)=>{const u=s.rm?1:clamp((k-.3-.12*i)/.1,0,1),g=s.rm?0:Math.max(0,1-Math.abs(k-.35-.12*i)*6);if(u<=0)return;glow(c,a[1],a[2],18,"#FFD890",(.15+.1*fl)*u+g*.5);drw(c,a[0],a[1],a[2],0,u);if(i===3)drw(c,"figs",a[1]+3,a[2]+3,0,u,1)});
    for(let j=0;j<2*fl;j++){const x=14+(164/(2*fl))*(j+.5),on=s.rm?1:clamp((k-.5-.06*j)*6,0,1);c.fillStyle="#2A2036";c.fillRect(x-.7,112,1.4,14);c.fillStyle="#FFE3A0";c.fillRect(x-1.5,109,3,4);glow(c,x,111,18,"#FFA850",.5*on)}
    walkers(s,c,t,k);gradeN(c,"night",.18*k)},
  auto(s,inp){if(s.fd>0)return;const o=s.F.list.find(o=>o.k===s.ans&&o.x>=30&&o.x<=170);if(o){inp.taps=[{x:o.x,y:o.y}];inp.tap=inp.taps[0]}}
};
}
})();
/* GAME:peripatos:END */
/* GAME:gate:BEGIN */
(function(){
{
/* Friends at the Gate (gate). Epicurus, “The Garden’s Gate”. Toolkit helper: mPick (also glow, gradeN, pfx). */
const K="epicurus_s",ST=["st_ring","st_jar","st_hat","st_brooch"],IN=["in_stars","in_lyre","in_scroll","in_figs"],CL=["plain","fine","hat","satchel"];
const WV=[[[0,1],[2,0],[1,3]],[[3,1],[0,2],[2,1],[0,3]]]; /* each wave: for stars, lyre, scroll, (figs) the two status things of that pair */
const T={L2:10,L3:5,SP:50,FL:.25,SHOW:.9,GX:[[56,96,136],[44,80,116,152]],GY:[112,160],BX:[24,48,72,96,120,144,168],BY:92,G:[18,212],RK:[30,204],LP:[96,146]};
if(typeof SFX!=="undefined"&&!SFX.gate_greet){
  SFX.gate_greet=()=>{aTone(AN(4),.1,{type:"triangle",v:.04,lp:1500});aTone(AN(9),.14,{type:"triangle",v:.035,lp:1500,at:.07})};
  SFX.gate_pair=()=>[0,4,7,12].forEach((n,i)=>aTone(AN(n-5),.7,{v:.03,lp:1800,at:i*.05,a:.03}));
  SFX.gate_peg=()=>{aNoise(.05,{f:900,q:3,v:.06,a:.003});aTone(AN(-10),.07,{type:"square",v:.02,lp:700,to:AN(-14)})};
  GAP.gate_greet=.1;GAP.gate_peg=.08}
function rng(a){return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function ico(c,n,x,y,sx,sc){c.save();c.translate(x,y);c.scale(sx,1);if(!mPiece(c,K,n,0,0,{ax:.5,ay:.5,sc})){c.fillStyle=["#E8C860","#B8785A","#C8A060","#E0B040","#9FB4E8","#C8A0E0","#E8E0C0","#8A5A9A"][ST.indexOf(n)>=0?ST.indexOf(n):4+IN.indexOf(n)];c.beginPath();c.arc(0,0,5*sc,0,7);c.fill()}c.restore()}
function pp(c,n,x,y,fl){const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];
  if(!r||!v||!mPerson(c,K,n,x,y,{ax:v[0]/r[2],ay:1,flip:fl})){c.fillStyle="#C8A878";c.fillRect(x-4,y-20,8,20);c.fillStyle="#E8C8A0";c.fillRect(x-3,y-24,6,5)}}
function wave(s){const w=s.wv,cols=T.GX[w].length,a=[];
  WV[w].forEach((p,it)=>p.forEach(st=>a.push({w,it,st})));
  for(let i=a.length;i>1;){const j=(s.rng()*i--)|0,q=a[i];a[i]=a[j];a[j]=q}
  a.forEach((g,i)=>{const o=s.cn[g.st]++,old=s.rng()<.5,cl=s.rng()*4|0;
    Object.assign(g,{m:"in",d:i*.25,x:T.G[0]+4,y:T.G[1]-2,tx:T.GX[w][i%cols],ty:T.GY[(i/cols)|0],f:0,ft:0,bw:0,pr:null,ic:1,lf:0,
      nm:(old?"old":"")+((o+s.off[g.st])%2?"woman":"man")+"_"+CL[g.st==2&&cl==2?3:cl]});s.G.push(g)});
  s.cur=a;s.K=mPick({items:a.map(()=>({x:0,y:0,w:26,h:32}))})}
function flip(g){g.ft=T.FL;g.f=1-g.f}
function go(g,x,y,dt){const dx=x-g.x,dy=y-g.y,d=Math.hypot(dx,dy),k=Math.min(1,T.SP*dt/(d||1));g.x+=dx*k;g.y+=dy*k;if(dx)g.fx=dx<0;return d<1}
function back(c){if(!mBg(c,K,0)){c.fillStyle="#1B2A2A";c.fillRect(0,0,192,320);c.fillStyle="#3A4A4A";c.fillRect(0,0,10,320);c.fillRect(10,78,182,18);
    c.fillStyle="#4A3A22";c.fillRect(93,120,6,50);glow(c,96,136,30,"#FFC860",.5)}}
function rack(c,L){c.fillStyle="#6B4A2C";c.fillRect(T.RK[0],T.RK[1]-4,66,2);c.fillRect(T.RK[0],T.RK[1]+8,66,2);for(let i=0;i<14;i++)c.fillRect(T.RK[0]+4+(i%7)*9,T.RK[1]-5+(i>6?12:0),2,3);
  L.forEach((r,i)=>ico(c,ST[r],T.RK[0]+5+(i%7)*9,T.RK[1]+(i>6?12:0),1,.75))}
MINI.gate={
  who:"epicurus",land:"l2",title:"Friends at the Gate",short:true,art:K,stages:["Leave Rank Outside"],
  setup:["Out there, everyone is sorted by rank. In here, we leave that at the gate.","Greet people to find out who they are. That’s how friends find each other."],
  how:"Tap two guests. If they love the same thing, they sit together.",
  win:"Rich or poor, free or not, from here or far away. In here, just friends.",
  walk:"The gate stays open. Come back and bring someone.",
  lines:[null],pad:true,ab:true,bloomT:2.2,limit:60,
  fl:["Everyone found a friend","A good memory for faces","A warm host"],
  flNext:["Remember what each guest loves.","Greet fewer people twice."],
  rate:s=>s.miss<=T.L3?3:s.miss<=T.L2?2:1,
  shotReady:s=>s.pairs>=5,
  init(s){s.rng=rng(s.seed!=null?s.seed:(Math.random()*4e9)|0);s.st=0;s.stT=0;
    Object.assign(s,{wv:0,G:[],cn:[0,0,0,0],off:[0,1,2,3].map(()=>s.rng()*2|0),pairs:0,miss:0,rack:[],fly:[],a:null,rs:null,lock:0,nt:-1,P:pfx(),pdx:0,pdy:0,cu:false,at:-9});wave(s)},
  step(s,dt,inp){s.stT+=dt;const q=Object.assign({},inp),L=inp.lTap||(inp.dx<-.5&&s.pdx>-.5),R=inp.rTap||(inp.dx>.5&&s.pdx<.5),U=inp.uTap||(inp.dy<-.5&&s.pdy>-.5),D=inp.dTap||(inp.dy>.5&&s.pdy<.5);
    s.pdx=inp.dx;s.pdy=inp.dy;q.lTap=q.rTap=q.uTap=q.dTap=false;if(L||R||U||D||inp.aTap)s.cu=true;if(inp.tap)s.cu=false;
    const it=s.K.items,ok=i=>!it[i].off;s.cur.forEach((g,i)=>{const o=it[i];o.x=g.x-13;o.y=g.y-16;o.off=g.m!=="stand"||g===s.a||!!g.pr||s.lock>0});
    if(L||R||U||D){let b=-1,bd=1e9;const cu=it[s.K.sel];it.forEach((o,i)=>{if(o.off||i===s.K.sel)return;const dx=o.x-cu.x,dy=o.y-cu.y,m=L?-dx:R?dx:U?-dy:dy,p=L||R?Math.abs(dy):Math.abs(dx);const d=m>1?m+p*2:1e4+m+p*2;if(d<bd){bd=d;b=i}});if(b>=0)s.K.sel=b}
    if(s.K.items[s.K.sel].off){const i=it.findIndex((o,j)=>!o.off);if(i>=0)s.K.sel=i}
    const i=s.K.step(dt,q);if(i>=0&&ok(i)){const g=s.cur[i];g.bw=.5;flip(g);sfx("gate_greet");s.lock=T.FL;if(s.a)s.rs={a:s.a,b:g,t:T.FL};else s.a=g}
    if(s.lock>0)s.lock-=dt;
    if(s.rs){const r=s.rs;r.t-=dt;if(r.t<=0&&!r.m){if(r.a.it===r.b.it){const n=s.pairs++,p={a:r.a,b:r.b,t:0,n,ph:0};r.a.pr=r.b.pr=p;s.a=s.rs=null;sfx("gate_pair")}else{s.miss++;r.m=1;r.t=T.SHOW;s.lock=T.SHOW+T.FL}}
      else if(r.m&&r.t<=0){flip(r.a);flip(r.b);s.a=s.rs=null}}
    let seat=0;
    s.G.forEach(g=>{g.ft=Math.max(0,g.ft-dt);g.bw=Math.max(0,g.bw-dt);g.lf+=dt;const p=g.pr;
      if(g.m==="in"){g.d-=dt;if(g.d<=0&&go(g,g.tx,g.ty,dt)){g.m="stand";g.fx=false}}
      else if(g.m==="walk"){const q=g===p.a?-6:6;if(p.t>.5&&go(g,T.BX[p.n]+q,T.BY-12,dt)&&p.ph>2){g.m="sit";g.fx=g===p.b}}
      if(g.m==="sit")seat++});
    s.G.forEach(g=>{const p=g.pr;if(p&&p.a===g&&p.ph<3){p.t+=dt;
      if(p.ph===0&&p.t>.5){p.ph=1;[p.a,p.b].forEach((h,k)=>{h.m="walk";s.fly.push({n:ST[h.st],x:h.x,y:h.y-22,tx:T.RK[0]+5+((2*p.n+k)%7)*9,ty:T.RK[1]+((2*p.n+k)>6?12:0),t:-k*.1,st:h.st})})}
      if(p.ph===1&&p.t>1.1){p.ph=3}}});
    s.fly=s.fly.filter(f=>{f.t+=dt;if(f.t>=.5){s.rack.push(f.st);sfx("gate_peg");return false}return true});
    s.G.forEach(g=>{if(g.pr&&g.pr.ph>=1)g.ic=0});
    if(s.wv===0&&seat===6&&s.nt<0)s.nt=1;
    if(s.nt>0){s.nt-=dt;if(s.nt<=0){s.wv=1;s.nt=-1;wave(s)}}
    pStep(s.P,dt,s.rm);
    return s.wv===1&&seat===14?"win":null},
  draw(s,c,t){back(c);rack(c,s.rack);const tt=s.rm?0:t;
    s.G.slice().sort((a,b)=>a.y-b.y).forEach(g=>{if(g.m==="in"&&g.d>0)return;const sit=g.m==="sit",mv=g.m==="walk"||g.m==="in",p=g.pr,f=(tt/400|0)%2;
      const pose=sit?"talk_"+((((tt/700|0)+(g===p.a?0:1))%2)):mv?"walk_"+f:g.bw>0?"bow":"stand_"+f,x=g.x,y=g.y+12;
      if(p&&p.ph===0)glow(c,x,g.y,18,"#FFC860",Math.min(.6,p.t*2));
      mShadow(c,x,y,12,.35);pp(c,g.nm+"_"+pose,x,y,g.fx);
      if(g.ic&&!sit){let face=g.f,sx=1;if(g.ft>0&&!s.rm){const k=1-g.ft/T.FL;face=k<.5?1-g.f:g.f;sx=Math.abs(1-2*k)}ico(c,face?IN[g.it]:ST[g.st],x,y-34,sx,1)}});
    s.G.forEach(g=>{const p=g.pr;if(p&&p.a===g&&p.ph===0){c.save();c.strokeStyle="#F5C66A";c.globalAlpha=Math.min(1,p.t*3);c.lineWidth=1;c.setLineDash([2,2]);c.beginPath();c.moveTo(p.a.x,p.a.y-4);c.lineTo(p.b.x,p.b.y-4);c.stroke();c.restore()}});
    s.fly.forEach(f=>{if(f.t<0)return;const k=E.inOut(Math.min(1,f.t/.5));ico(c,f.n,lerp(f.x,f.tx,k),lerp(f.y,f.ty,k)-Math.sin(k*3.14)*8,1,1-.25*k)});
    pDraw(c,s.P,K);
    if(s.cu&&s.cur.length){s.K.draw(c,(c,o,i,sel)=>{if(sel&&!o.off){c.strokeStyle="#F5C66A";c.lineWidth=1.5;c.strokeRect(o.x+.5,o.y+.5,o.w-1,o.h-1)}})}},
  bloom(s,c,k,t){const tt=s.rm?0:t,e=E.out(Math.min(1,k*2.2)),f=s._fl||1;back(c);glow(c,18,212,10+26*k,"#FFD98A",.5*k);rack(c,s.rack);
    glow(c,T.LP[0],T.LP[1]-10,34+8*f,"#FFC860",.35+.1*f);
    if(f>2){c.fillStyle="#4A3A22";c.fillRect(157,134,2,26);c.fillRect(155,128,6,6);glow(c,158,128,22,"#FFC860",.5)}
    const n=s.G.length,L=[];s.G.forEach((g,i)=>{const p=g.pr||{n:i%7,a:g},sx=T.BX[p.n]+(g===p.a?-6:6),a=(i+.5)/n*6.283-1.57,rx=T.LP[0]+Math.cos(a)*56,ry=T.LP[1]-6+Math.sin(a)*22;
      L.push([ry,g.nm+"_stand_"+((tt/450|0)%2),lerp(sx,rx,e),lerp(T.BY,ry,e),rx<T.LP[0]])});
    L.sort((a,b)=>a[0]-b[0]).forEach(o=>{mShadow(c,o[2],o[3],12,.35);pp(c,o[1],o[2],o[3],o[4])});
    const ex=lerp(24,118,E.inOut(Math.max(0,(k-.1)/.9)));pp(c,"epi_walk_"+(k>=1||s.rm?0:(tt/250|0)%2),ex,T.LP[1]+8,false);
    const gl=k>.3&&k<.6?Math.sin((k-.3)/.3*3.14):0;if(gl>0)s.rack.forEach((r,i)=>glow(c,T.RK[0]+5+(i%7)*9,T.RK[1]+(i>6?12:0)+4,8,"#FFF1C8",gl));
    for(let i=0;i<6*f;i++){const a=i*2.4+tt/900,r=18+i*3%26;glow(c,T.LP[0]+Math.cos(a)*r*1.3,T.LP[1]-30+Math.sin(a*1.3)*r*.6,5,"#FFE9B8",.7*Math.min(1,k*2))}
    gradeN(c,"warm",.12*k)},
  auto(s,inp){if(s.lock>0||s.t-s.at<.3)return;const g=s.a?s.cur.find(h=>h.m==="stand"&&!h.pr&&h!==s.a&&h.it===s.a.it):s.cur.find(h=>h.m==="stand"&&!h.pr&&s.cur.some(o=>o!==h&&o.m==="stand"&&!o.pr&&o.it===h.it));
    if(g){inp.taps=[{x:g.x,y:g.y}];inp.tap=inp.taps[0];s.at=s.t}}
};
}
})();
/* GAME:gate:END */
/* GAME:cure:BEGIN */
(function(){
{
/* Four Moths (cure), Epicurus. Helper: none (own swipe). */
const K="epicurus_s",MO=["moth_gods","moth_death","moth_want","moth_pain"],LN=["lant_cloud","lant_moon","lant_bowl","lant_star"],CO=["#9FB0C8","#8A5CC8","#E8A83C","#E0607A"];
const C=[[26,44],[166,44],[26,206],[166,206]],LP=[96,136],RA=28*Math.PI/180;
if(typeof SFX!=="undefined"&&!SFX.cure_open){
  SFX.cure_flutter=()=>aNoise(.05,{type:"highpass",f:3000,q:.6,v:.02,a:.004});
  SFX.cure_open=()=>{aNoise(.04,{f:1800,q:4,v:.05,a:.003});aTone(AN(7),.25,{v:.04,lp:1600,at:.04})};
  SFX.cure_bump=()=>{aNoise(.08,{type:"lowpass",f:500,q:.5,v:.07,a:.004});aTone(AN(-17),.09,{v:.05,lp:400})};
  SFX.cure_glow=i=>aTone(AN([0,4,7,12][i|0]),.6,{v:.04,lp:2200,a:.02});
  GAP.cure_flutter=.1;GAP.cure_bump=.2}
function rng(a){return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function spr(c,n,x,y,sx,sy,rot){const A=MINI_ART[K],r=A&&A.rects&&A.rects[n],e=r&&mImgE(A.atlas);if(!e||!e.ok)return false;
  c.save();c.translate(x,y);if(rot)c.rotate(rot);c.scale(sx,sy);c.drawImage(e.img,r[0],r[1],r[2],r[3],-r[2]/4,-r[3]/4,r[2]/2,r[3]/2);c.restore();return true}
function ang(a,b){return Math.atan2(b[1]-a.y,b[0]-a.x)}
function wr(a){return Math.atan2(Math.sin(a),Math.cos(a))}
function orb(s){return s.M.filter(m=>m.m==="orbit").sort((a,b)=>wr(a.a)-wr(b.a))}
function pos(s,m){const f=s.rm?0:3;m.x=LP[0]+Math.cos(m.a)*m.r+Math.sin(s.t*7+m.ph)*f;m.y=LP[1]+Math.sin(m.a)*m.r+Math.cos(s.t*5+m.ph)*f}
function put(s,k,r){const m={k,m:"orbit",a:s.rng()*6.283,r,r0:26+s.rng()*14,w:1.4+s.rng()*.6,ph:s.rng()*6,h:0,d:0,t:0};s.M.push(m);s.hl=s.hl||m;pos(s,m)}
function send(s,m,a,t){m.m="fly";m.h=a;m.tg=t;m.d=0;sfx("cure_flutter");if(s.hl===m)s.hl=null}
function flick(s,m,a){
  const d=C.map(p=>Math.abs(wr(ang(m,p)-a))),k=m.k;let t=-1;
  if(d[k]<=RA)t=k;else{let b=RA;d.forEach((v,i)=>{if(v<=b){b=v;t=i}})}
  send(s,m,t>=0?ang(m,C[t]):a,t)}
function lant(c,s,i){const[x,y]=C[i],l=s.L[i],o=Math.max(l.op,l.p/3);
  if(!spr(c,LN[i],x,y,1,1)){c.fillStyle=CO[i];c.fillRect(x-6,y-10,12,20)}
  glow(c,x,y+3,10+4*l.p,"#FFD98A",.14*l.p+.5*l.op);
  c.fillStyle="rgba(18,22,44,"+(.85*(1-Math.min(1,o)))+")";c.fillRect(x-3.5,y,7,7.5);
  for(let j=0;j<3;j++){c.fillStyle=j<l.p?"#FFE9A8":"rgba(16,11,21,.7)";c.beginPath();c.arc(x-5+j*5,y+15,1.6,0,7);c.fill()}
  if(l.cu>=0&&l.cu<1.6){const q=l.cu,a=Math.sin(Math.min(1,q/1.6)*3.14),dx=LP[0]-x,dy=LP[1]-y,n=Math.hypot(dx,dy),px=x+dx/n*22,py=y+dy/n*22;c.save();c.globalAlpha=a;
    c.fillStyle="rgba(14,20,48,.75)";c.beginPath();c.arc(px,py,10,0,7);c.fill();
    if(i===0)for(let j=0;j<5;j++)glow(c,px+Math.cos(j*1.9)*5,py+Math.sin(j*2.7)*5,3,"#FFF1C8",.6+(s.rm?0:.3*Math.sin(q*6+j)))
    else if(i===1){glow(c,px,py,12,"#CFE0FF",.5);c.fillStyle="#EAF0FF";c.beginPath();c.arc(px,py,4,0,7);c.fill();c.fillStyle="#0E1430";c.beginPath();c.arc(px+2,py-1,3.6,0,7);c.fill()}
    else if(i===2){glow(c,px,py,12,"#FFC860",.5);c.fillStyle="#C98A3C";c.beginPath();c.ellipse(px,py,5,3,0,0,7);c.fill()}
    else{c.strokeStyle="#FFC8D0";c.globalAlpha=a*(1-q/1.6);for(let j=0;j<8;j++){const u=Math.cos(j*.785),v=Math.sin(j*.785);c.beginPath();c.moveTo(px+u*2,py+v*2);c.lineTo(px+u*8,py+v*8);c.stroke()}glow(c,px,py,10,"#FFC8D0",.5*Math.min(1,q))}
    c.restore()}}
function moth(c,s,m,t){const f=s.rm||(t/120|0)%2?1:.6,rot=(m.m==="fly"?m.h:m.a+1.57)+1.57,sc=m.m==="in"?1-m.t/.4:1;if(sc<=0)return;
  if(!spr(c,MO[m.k],m.x,m.y,sc,f*sc,rot)){c.fillStyle=CO[m.k];c.beginPath();c.ellipse(m.x-4,m.y,4,5*f,0,0,7);c.ellipse(m.x+4,m.y,4,5*f,0,0,7);c.fill()}}
function ff(s,i,k,t,n){const a=i*2.4+(s.rm?0:t/2500)+k*3,r=10+(k*50)*(.4+.6*i/n);return[LP[0]+Math.cos(a)*r*1.2,LP[1]-k*28+Math.sin(a)*r*.7]}
MINI.cure={
  who:"epicurus",land:"l2",title:"Four Moths",short:true,art:K,stages:["The Four-Part Cure"],
  setup:["Fears flutter around a mind the way moths circle a lamp.","There are four big ones, and each has its own cure."],
  how:"Flick each moth toward the lantern that matches its shape and color.",
  win:"Gods, death, going without, pain. Four fears, four cures. Sleep well.",
  walk:"Keep the tablet. Read it whenever the moths come back.",
  lines:[null],pad:true,ab:true,bloomT:2,limit:60,
  fl:["The garden is calm","Most fears found their cure","Every fear in its place"],
  flNext:["Match both the color and the shape.","Look at the moth’s wing marks before you flick."],
  rate:s=>s.miss===0?3:s.miss<=3?2:1,
  shotReady:s=>s.cured>=5,
  init(s){s.rng=rng(s.seed!=null?s.seed:(Math.random()*4e9)|0);s.st=0;s.stT=0;
    const q=[0,0,0,1,1,1,2,2,2,3,3,3];for(let i=12;i>1;){const j=(s.rng()*i--)|0,v=q[i];q[i]=q[j];q[j]=v}
    Object.assign(s,{M:[],q,nq:0,tm:[],L:[0,1,2,3].map(()=>({p:0,op:0,cu:-1})),ff:[],cured:0,miss:0,sw:null,au:null,hl:null,pd:false,sp:1,lg:1,dk:0,wt:0,pdx:0,pdy:0,P:pfx()});
    for(let i=0;i<3;i++)put(s,q[s.nq++],34)},
  step(s,dt,inp){s.stT+=dt;const d=inp.dx,e=inp.dy,L=inp.lTap||(d<-.5&&s.pdx>-.5),R=inp.rTap||(d>.5&&s.pdx<.5),dg=Math.abs(d)>.5&&Math.abs(e)>.5;s.pdx=d;s.pdy=e;
    if(L||R||dg||inp.aTap||d||e)s.pd=true;if(inp.tap)s.pd=false;
    s.sp+=((s.pd?.6:1)-s.sp)*Math.min(1,dt*6);const sd=dt*s.sp;
    let o=orb(s);if(!s.hl||s.hl.m!=="orbit")s.hl=o[0]||null;
    if((L||R)&&!dg&&e===0&&o.length){const i=o.indexOf(s.hl);s.hl=o[(i+(R?1:o.length-1)+(i<0?1:0))%o.length]}
    if(inp.aTap&&dg&&s.hl){const t=(d>0?1:0)+(e>0?2:0);send(s,s.hl,ang(s.hl,C[t]),t)}
    /* own swipe: touch within 16 u of a circling moth, release at 120 u/s or faster over 18 u or more */
    if(inp.tap&&!s.sw){let b=16,m=null;o.forEach(v=>{const r=Math.hypot(v.x-inp.tap.x,v.y-inp.tap.y);if(r<b){b=r;m=v}});if(m)s.sw={m,x:inp.tap.x,y:inp.tap.y,h:[]}}
    if(s.sw){const w=s.sw;if(inp.down)w.h.push([s.t,inp.down.x,inp.down.y]);else if(!inp.ups.length)s.sw=null;
      while(w.h.length>1&&s.t-w.h[0][0]>.12)w.h.shift();
      if(inp.ups.length){const u=inp.ups[0],p=w.h[0]||[s.t,w.x,w.y],dt2=w.h.length>1?s.t-p[0]:u.t/1000,v=Math.hypot(u.x-p[1],u.y-p[2])/Math.max(.02,dt2),n=Math.hypot(u.x-w.x,u.y-w.y);
        if(w.m.m==="orbit"&&v>=120&&n>=18)flick(s,w.m,Math.atan2(u.y-p[2],u.x-p[1]));s.sw=null}}
    s.M.forEach(m=>{m.t+=dt;
      if(m.m==="orbit"){m.a+=m.w*sd;m.r+=(m.r0-m.r)*Math.min(1,dt*3);pos(s,m)}
      else if(m.m==="fly"){const v=140*s.sp*dt;if(m.tg>=0){const g=C[m.tg],da=wr(ang(m,g)-m.h);m.h+=Math.max(-5*dt,Math.min(5*dt,da))}
        m.x+=Math.cos(m.h)*v;m.y+=Math.sin(m.h)*v;m.d+=v;
        if(m.tg>=0&&Math.hypot(C[m.tg][0]-m.x,C[m.tg][1]-m.y)<8){if(m.tg===m.k){m.m="in";m.t=0;s.L[m.k].op=1;sfx("cure_open")}else{s.miss++;sfx("cure_bump");pDust(s.P,m.x,m.y,6,"rgba(200,190,200,.7)");m.m="orbit";m.a=Math.atan2(m.y-LP[1],m.x-LP[0]);m.r=Math.hypot(m.x-LP[0],m.y-LP[1])}}
        else if(m.tg<0&&m.d>=50){m.m="orbit";m.a=Math.atan2(m.y-LP[1],m.x-LP[0]);m.r=Math.hypot(m.x-LP[0],m.y-LP[1])}}
      else if(m.m==="in"){const g=C[m.k];m.x+=(g[0]-m.x)*Math.min(1,dt*8);m.y+=(g[1]+3-m.y)*Math.min(1,dt*8);
        if(m.t>=.4){m.m="done";const l=s.L[m.k];l.p++;l.cu=0;sfx("cure_glow",m.k);s.cured++;s.ff.push({x:g[0],y:g[1],t:0});if(s.nq+s.tm.length<12)s.tm.push(1.2)}}});
    s.M=s.M.filter(m=>m.m!=="done");
    s.L.forEach(l=>{l.op=Math.max(0,l.op-dt*1.6);if(l.cu>=0)l.cu+=dt});s.ff.forEach(f=>f.t+=dt);
    s.tm=s.tm.filter(t=>{if(s.nq>=12)return false;if(t-dt>0)return true;if(s.M.filter(m=>m.m==="orbit").length>=4)return true;put(s,s.q[s.nq++],110);return false}).map(t=>Math.max(0,t-dt));
    const n=s.M.filter(m=>m.m==="orbit").length;s.lg+=((1-.08*n)-s.lg)*Math.min(1,dt*4);s.dk+=(n*.05-s.dk)*Math.min(1,dt*4);
    pStep(s.P,dt,s.rm);if(s.cured>=12)s.wt+=dt;return s.wt>=1?"win":null},
  draw(s,c,t){if(!mBg(c,K,0)){c.fillStyle="#17222A";c.fillRect(0,0,192,320)}gradeN(c,"night",.5);
    glow(c,LP[0],LP[1],40,"#FFC860",s.lg*.9);
    s.ff.forEach((f,i)=>{const k=Math.min(1,f.t/2.5),h=ff(s,i,1,t,12);glow(c,lerp(f.x,h[0],E.out(k)),lerp(f.y,h[1],E.out(k)),4,"#FFE9B8",.6)});
    for(let i=0;i<4;i++)lant(c,s,i);
    s.M.forEach(m=>{moth(c,s,m,s.rm?0:t);if(s.pd&&m===s.hl){c.strokeStyle="#F5C66A";c.lineWidth=1;c.beginPath();c.arc(m.x,m.y,10,0,7);c.stroke()}});
    if(s.pd&&s.hl){const dx=s.pdx,dy=s.pdy;if(Math.abs(dx)>.5&&Math.abs(dy)>.5){const g=C[(dx>0?1:0)+(dy>0?2:0)];c.strokeStyle="rgba(245,198,106,.5)";c.beginPath();c.moveTo(s.hl.x,s.hl.y);c.lineTo(g[0],g[1]);c.stroke()}}
    pDraw(c,s.P,K);grade(c,"#0A0820",s.dk)},
  bloom(s,c,k,t){const tt=s.rm?0:t,f=s._fl||1,n=6+6*f;if(!mBg(c,K,0)){c.fillStyle="#17222A";c.fillRect(0,0,192,320)}gradeN(c,"night",.5);
    glow(c,LP[0],LP[1],40+14*k,"#FFC860",.9+.3*k);s.L.forEach((l,i)=>{l.p=3;l.op=.2;l.cu=-1;lant(c,s,i)});
    for(let i=0;i<n;i++){const p=ff(s,i,E.out(k),tt,n);glow(c,p[0],p[1],5,"#FFE9B8",.8*Math.min(1,k*3))}},
  auto(s,inp){let a=s.au,m=s.hl;if(!a){if(!m||m.m!=="orbit"||s.M.some(v=>v.m==="fly"||v.m==="in"))return;a=s.au={m,f:0,x:m.x,y:m.y};inp.taps=[{x:m.x,y:m.y}];inp.tap=inp.taps[0];inp.down={x:m.x,y:m.y};return}
    m=a.m;const r=ang(m,C[m.k]);if(a.f===0){a.f=1;inp.down={x:a.x+Math.cos(r)*12,y:a.y+Math.sin(r)*12}}else{inp.ups=[{x:a.x+Math.cos(r)*30,y:a.y+Math.sin(r)*30,t:100}];s.au=null}}
};
}
})();
/* GAME:cure:END */
/* GAME:letters:BEGIN */
(function(){
{
/* Rehearse the Storm (letters), Seneca. Helper: mFlow (the course). Art: seneca_s. */
const K="seneca_s",BY=200,LEN=900,V=26,SX=[66,128,46,56];
const H=[[60,100],[132,160],[96,230],[40,300],[150,340],[100,420],[56,500],[140,560],[90,650],[130,760]].map((p,i)=>({k:0,x:p[0],y:p[1],r:i%2?8:6}))
  .concat([[260,1],[460,-1],[600,1],[720,-1]].map((p,i)=>({k:1,x:SX[i],y:p[0],d:p[1]})));
const FREE=[96,96,74,74,74,74,78,78,68,68]; /* a free x past each rock, worked out ahead of time (auto) */
const mp=(h,ox,oy,k)=>[ox+(h.x-16)*k,oy+(190-.2*h.y)*k],pos=i=>i<14?mp(H[i],16,20,1):[96,232];
const see=(s,i,ah)=>ah<=(s.m[i]?140:50); /* sight: 140 units for a marked hazard, 50 for an unmarked one */
const Vo=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
Vo("letters_scratch",()=>aNoise(.14,{type:"highpass",f:3800,q:.7,v:.04,a:.01}));
Vo("letters_unfold",()=>aNoise(.4,{f:900,to:2400,q:.6,v:.05,a:.12}));
Vo("letters_bump",()=>{aTone(AN(-17),.14,{type:"triangle",v:.07,lp:500,to:AN(-24)});aNoise(.06,{f:500,v:.04})});
Vo("letters_gust",()=>aNoise(.7,{f:300,to:1200,q:.5,a:.3,v:.07}));
Vo("letters_harbor",()=>aTone(1046,1.1,{v:.06,a:.004}));
if(typeof GAP!=="undefined"){GAP.letters_scratch=.1;GAP.letters_bump=.3;GAP.letters_gust=1}
const go=s=>{if(!s.ph){s.ph=1;s.ft=0;sfx("letters_unfold")}};
function mark(s,i){if(s.m[i])return;s.m[i]=1;s.ink[i]=0;s.marked++;sfx("letters_scratch");const n=s.m.findIndex(v=>!v);s.cur=n<0?14:n}
function nav(s,d){const a=pos(s.cur);let b=-1,bs=1e9;for(let j=0;j<15;j++){if(j===s.cur)continue;const q=pos(j),x=q[0]-a[0],y=q[1]-a[1];if(x*d[0]+y*d[1]<=0)continue;const v=Math.hypot(x,y)+2*Math.abs(x*d[1]-y*d[0]);if(v<bs){bs=v;b=j}}if(b>=0)s.cur=b}
function back(c){if(!mBg(c,K,0)){c.fillStyle="#12404A";c.fillRect(0,0,192,224);c.fillStyle="#2A2430";c.fillRect(0,0,34,200);c.fillRect(158,0,34,200);c.fillStyle="#8A8F98";c.fillRect(0,226,192,44);c.fillStyle="#3A2A24";c.fillRect(0,272,192,48)}}
function boat(c,x,y,r){if(!mPiece(c,K,"boat",x,y,{ax:.5,ay:.5,sc:1.4,rot:r,sm:true})){c.fillStyle="#C9A35A";c.fillRect(x-7,y-14,14,28)}}
function spiral(c,r,col,w){c.strokeStyle=col;c.lineWidth=w;c.beginPath();for(let a=0;a<11;a+=.35){const q=a*.5*r;a?c.lineTo(Math.cos(a)*q,Math.sin(a)*q):c.moveTo(0,0)}c.stroke()}
function blot(c,h,m,x,y,k,a){c.save();c.translate(x,y);c.scale(k,k);c.lineCap="round";c.lineJoin="round";c.globalAlpha=a;
  if(!h.k){if(m){c.strokeStyle="#2A1F3A";c.lineWidth=1.1;c.beginPath();[[-6,1],[-4,-5],[1,-6],[6,-2],[5,4],[-1,6]].forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.stroke();c.stroke()}
    else{c.fillStyle="rgba(120,112,120,.4)";c.beginPath();c.arc(0,0,4,0,7);c.fill()}}
  else if(m){spiral(c,1.1,"#2A1F3A",1);c.scale(h.d,1);c.beginPath();c.moveTo(-9,10);c.lineTo(9,10);c.lineTo(5,7.5);c.moveTo(9,10);c.lineTo(5,12.5);c.stroke()}
  else spiral(c,.75,"rgba(120,112,120,.45)",1.6);c.restore()}
function haz(c,s,o,t){const h=H[o.i],m=s.m[o.i],ah=BY-o.y;if(!see(s,o.i,ah))return;c.save();c.globalAlpha=ah<0?1:clamp(((m?140:50)-ah)/14,0,1);
  if(h.k){c.fillStyle=m?"rgba(60,70,90,.2)":"rgba(10,12,22,.5)";c.fillRect(44,o.y-20,104,40);c.strokeStyle=m?"#E8F0F8":"#9AA6B8";c.lineWidth=.8;
    for(let u=0;u<8;u++){const x=44+(((u*37)%104)+(s.rm?0:t/1000*h.d*(28+u*3))+208)%104,y=o.y-17+u*5;c.beginPath();c.moveTo(x,y);c.lineTo(x+h.d*10,y);c.stroke()}
    if(!mPiece(c,K,"squall",h.x,o.y,{ax:.5,ay:.5,rot:s.rm?0:t/900*h.d,sm:true})){c.fillStyle="#3A3A4A";c.beginPath();c.arc(h.x,o.y,10,0,7);c.fill()}
    if(m){c.strokeStyle="#FFE9B8";c.lineWidth=1;c.beginPath();c.moveTo(96-h.d*10,o.y);c.lineTo(96+h.d*10,o.y);c.lineTo(96+h.d*5,o.y-4);c.moveTo(96+h.d*10,o.y);c.lineTo(96+h.d*5,o.y+4);c.stroke()}}
  else{if(!mPiece(c,K,h.r>6?"rock_b":"rock_a",o.x,o.y,{ax:.5,ay:.5})){c.fillStyle="#1A1620";c.beginPath();c.arc(o.x,o.y,h.r+1,0,7);c.fill()}
    if(m){c.strokeStyle="#FFE9B8";c.lineWidth=.9;c.setLineDash([2,2]);c.beginPath();c.arc(o.x,o.y,h.r+5,0,7);c.stroke()}}c.restore()}
function scene(c,s,t){back(c);c.save();c.beginPath();c.rect(0,0,192,224);c.clip();for(const o of s.F.list)haz(c,s,o,t);
  boat(c,s.bx,BY,s.rm?0:Math.sin(t/400)*.04);
  if(s.rg<.5){c.strokeStyle="#F5C66A";c.globalAlpha=1-s.rg*2;c.lineWidth=1.2;c.beginPath();c.arc(s.bx,BY,12+s.rg*36,0,7);c.stroke();c.globalAlpha=1}
  pDraw(c,s.P,K);c.restore();gradeN(c,"storm",.4);vignette(c,.65);glow(c,96,8,10+24*s.p/LEN,"#FFE3A0",.25+.6*s.p/LEN)}
function letter(c,s,t){const k=s.ph?Math.min(1,s.ft/.6):0;c.save();c.translate(96,120+(s.rm?0:110*E.in(k)));c.scale(1,s.rm?1:1-.9*k);c.globalAlpha=1-k;c.translate(-96,-120);
  if(!mPiece(c,K,"letter",16,20,{sc:2})){c.fillStyle="#E8DCC0";c.fillRect(16,20,160,200);c.strokeStyle="#B89A62";c.strokeRect(16.5,20.5,159,199)}
  H.forEach((h,i)=>{const q=pos(i);blot(c,h,s.m[i],q[0],q[1],s.m[i]?.8+.2*Math.min(1,s.ink[i]/.3):1,s.m[i]?.3+.7*Math.min(1,s.ink[i]/.3):1)});
  if(s.kc&&s.cur<14){const q=pos(s.cur);c.strokeStyle="#F5C66A";c.lineWidth=1;c.setLineDash([2,2]);c.beginPath();c.arc(q[0],q[1],9,0,7);c.stroke();c.setLineDash([])}c.restore();
  if(s.ph<2){c.save();c.globalAlpha=1-k;if(s.marked===14)glow(c,96,232,22,"#F5C66A",.5);if(!mPiece(c,K,"seal",96,232,{ax:.5,ay:.5,sc:1.3,sm:true})){c.fillStyle="#9E2A2B";c.fillRect(80,221,32,22)}
    mText(c,"Sail",96,232.5,8,"#FFE9B8");if(s.kc&&s.cur===14){c.strokeStyle="#F5C66A";c.strokeRect(79.5,220.5,33,23)}c.restore()}}
MINI.letters={
  who:"seneca",land:"l2",title:"Rehearse the Storm",short:true,art:K,stages:["Read, Then Sail"],see,
  setup:["Let’s rehearse a hard voyage before we make it. That’s what my letters are for.","Think a storm through ahead of time, and it hits much softer."],
  how:"Tap each blot to think it through. Then sail, and steer with your finger.",
  win:"Every rock was one you’d already met on paper. That’s the trick.",
  walk:"Keep the letters. Read one before each hard day.",
  lines:[null],pad:true,ab:true,bloomT:2,limit:90,
  fl:["Safe in harbor","A steady voyage","Nothing took you by surprise"],flNext:["Mark more blots before you sail.","Think through every blot first."],
  rate:s=>s.bumps===0&&s.marked>=14?3:s.bumps<=2?2:1,
  shotReady:s=>s.ph===2&&s.p>350,
  init(s){const F=mFlow({dir:[0,1],speed:V,bounds:[-60,-1000,312,1400]});H.forEach((h,i)=>F.spawn({i,x:h.x,y:BY-h.y}));
    Object.assign(s,{st:0,stT:0,T:0,ph:0,ft:0,m:Array(14).fill(0),ink:Array(14).fill(0),marked:0,bumps:0,cur:0,kc:0,p:0,bx:96,bo:0,slow:0,rg:9,F,P:pfx(),aL:0,hb:0,tx:96})},
  step(s,dt,inp){s.T+=dt;s.stT+=dt;
    if(s.ph===0){s.ink=s.ink.map(v=>v+dt);
      for(const tp of inp.taps||[]){if(Math.abs(tp.x-96)<=18&&Math.abs(tp.y-232)<=13){go(s);return null}let b=-1,bd=12;H.forEach((h,i)=>{const q=pos(i),d=Math.hypot(q[0]-tp.x,q[1]-tp.y);if(d<bd){bd=d;b=i}});if(b>=0)mark(s,b)}
      const d=inp.lTap?[-1,0]:inp.rTap?[1,0]:inp.uTap?[0,-1]:inp.dTap?[0,1]:null;if(d){s.kc=1;nav(s,d)}
      if(inp.aTap){s.kc=1;if(s.cur===14)go(s);else mark(s,s.cur)}if(inp.bTap)go(s);return null}
    if(s.ph===1){s.ft+=dt;if(s.ft>=.6)s.ph=2;return null}
    const sl=s.slow>0?.5:1;s.slow=Math.max(0,s.slow-dt);s.rg+=dt;s.F.speed=V*sl;s.F.step(dt);s.p+=V*sl*dt;
    const f=inp.down,mv=f?clamp(f.x-s.bx,-80*dt,80*dt):inp.dx*70*dt;let ps=0;
    for(const o of s.F.list){const h=H[o.i];
      if(h.k){if(Math.abs(BY-o.y)<=20){ps+=h.d*(s.m[o.i]?18:40);if(!o.in){o.in=1;sfx("letters_gust")}}}
      else if(!o.hit&&Math.hypot(o.x-clamp(o.x,s.bx-10,s.bx+10),o.y-clamp(o.y,BY-14,BY+14))<h.r){o.hit=1;s.bumps++;s.slow=.8;s.rg=0;sfx("letters_bump");let d=s.bx>=o.x?1:-1;if(s.bx+d*14>146||s.bx+d*14<46)d=-d;s.bo=d*14}}
    let b=0;if(s.bo){b=Math.sign(s.bo)*Math.min(Math.abs(s.bo),70*dt);s.bo-=b}
    s.bx=clamp(s.bx+mv+ps*dt+b,46,146);if(!s.rm)pRain(s.P,2,"rgba(170,185,205,.5)",-30);pStep(s.P,dt,s.rm);
    return s.p>=LEN?"win":null},
  draw(s,c,t){scene(c,s,t);if(s.ph<2)letter(c,s,t)},
  bloom(s,c,k,t){const f=s._fl||1,e=E.out(Math.min(1,k*1.5));if(k>=.15&&!s.hb){s.hb=1;sfx("letters_harbor")}
    back(c);c.save();c.beginPath();c.rect(0,0,192,224);c.clip();boat(c,lerp(s.bx,112,e),lerp(BY,58,e),0);c.restore();
    gradeN(c,"storm",.4*(1-k));vignette(c,.2+.45*(1-k));shaft(c,96,0,150,90,0,"#FFE9B8",.2*k);glow(c,96,8,22+30*k,"#FFE3A0",.5+.4*k);
    c.fillStyle="#4A3424";c.fillRect(150,126,42,3);if(!mPerson(c,K,(s.rm?0:Math.floor(t/300)%2)?"friend_wave_1":"friend_wave_0",176,126,{ax:10/19,ay:1})){c.fillStyle="#4F7E3E";c.fillRect(171,104,10,22)}
    glow(c,169,101,16,"#FFD27A",.55);
    c.save();c.translate(0,22);c.scale(1,E.out(Math.min(1,k*3)));c.translate(0,-22);
    if(!mPiece(c,K,"letter",4,22,{})){c.fillStyle="#E8DCC0";c.fillRect(4,22,80,100)}
    H.forEach((h,i)=>{const q=mp(h,4,22,.5),g=clamp((k-.2-i*.04)/.1,0,1);blot(c,h,s.m[i],q[0],q[1],.6,1);if(g>0){glow(c,q[0],q[1],6,"#F5C66A",g*(.35+.2*f));c.fillStyle="#E8B84A";c.globalAlpha=g;c.fillRect(q[0]-1,q[1]-1,2,2);c.globalAlpha=1}});c.restore()},
  auto(s,inp){if(s.ph===0){if(s.T-s.aL<.4)return;s.aL=s.T;const i=s.m.findIndex(v=>!v),q=pos(i<0?14:i),tp={x:q[0],y:q[1]};inp.tap=tp;inp.taps=[tp]}
    else if(s.ph===2){for(const o of s.F.list)if(!H[o.i].k&&BY-o.y>-26){if(BY-o.y<=40)s.tx=FREE[o.i];break}inp.dx=clamp((s.tx-s.bx)/6,-1,1)}}
};
}
})();
/* GAME:letters:END */
/* GAME:sealring:BEGIN */
(function(){
{
/* A Steady Hand (sealring). Seneca, "A Statesman’s Ring". Toolkit helper: mHold (the dwell ring). Art key seneca_s. */
const K="seneca_s",CX=96,CY=140,D=Math.PI/180,Z=7,SK=.15;
const Vo=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
Vo("seal_turn",()=>aTone(AN(-5),.04,{type:"triangle",v:.03,lp:1600}));
Vo("seal_mood",()=>{aTone(AN(-24),.7,{v:.07,lp:300,a:.25,to:AN(-22)});aNoise(.6,{f:260,q:.5,v:.03,a:.3})});
Vo("seal_tremble",()=>{aNoise(.35,{type:"highpass",f:3200,q:.8,v:.035,a:.02});aTone(AN(14),.3,{type:"square",v:.012,lp:2400})});
Vo("seal_press",()=>{aNoise(.1,{f:700,to:300,q:.6,v:.06,a:.01});aTone(AN(-19),.16,{v:.06,lp:420})});
if(typeof GAP!=="undefined"){GAP.seal_turn=.05;GAP.seal_mood=1;GAP.seal_tremble=.5}
const wr=a=>a-360*Math.round(a/360),kn=()=>(Math.random()<.5?-1:1)*(35+45*Math.random()),md=()=>2.4+.8*Math.random();
function turn(s,g){s.U+=g;s.a=wr(s.a+g);s.acc+=Math.abs(g);while(s.acc>=15){s.acc-=15;sfx("seal_turn")}}
function docu(c,x,y,sx,sy,a,sl){c.save();c.globalAlpha=a;c.translate(x,y);c.scale(sx,sy);
  if(!mPiece(c,K,"document",0,0,{ax:.5,ay:.5})){c.fillStyle="#E8DCC0";c.fillRect(-24,-24,48,48);c.fillStyle="#9E2A2B";c.beginPath();c.arc(13,11,6,0,7);c.fill()}
  if(sl>0&&!mPiece(c,K,"seal",13.5,10.8,{ax:.5,ay:.5,sc:sl})){c.fillStyle="#B0282E";c.beginPath();c.arc(13.5,10.8,8*sl,0,7);c.fill()}c.restore()}
function roll(c,x,y,g){c.save();c.globalAlpha=1;c.fillStyle="#E8DCC0";c.fillRect(x-14,y-3,28,6);c.fillStyle="#C9B88E";c.fillRect(x-14,y+1.5,28,1.5);
  if(!mPiece(c,K,"seal",x,y,{ax:.5,ay:.5,sc:.4})){c.fillStyle="#B0282E";c.fillRect(x-3,y-3,6,6)}c.restore();if(g)glow(c,x,y,16,"#F5C66A",g)}
function back(c){if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,224);g.addColorStop(0,"#1B3A44");g.addColorStop(1,"#0F4A4C");c.fillStyle=g;c.fillRect(0,0,192,224);c.fillStyle="#2A2430";c.fillRect(0,0,34,200);c.fillRect(158,0,34,200);c.fillStyle="#8A8F98";c.fillRect(0,226,192,44);c.fillStyle="#3A2A24";c.fillRect(0,272,192,48)}}
function chair(c,x,y,sc,a){c.save();c.globalAlpha=a;if(!mPiece(c,K,"chair",x,y,{ax:.5,ay:.5,sc,sm:true})){c.fillStyle="#7A5A24";c.fillRect(x-14*sc,y-24*sc,28*sc,48*sc)}c.restore()}
function sen(c,x,y,n){if(!mPerson(c,K,n,x,y,{ax:8/14,ay:1})){c.fillStyle="#E8E0D0";c.fillRect(x-6,y-20,12,20)}}
function press(s){s.seals++;s.busy=1;s.q=0;s.rs=0;sfx("seal_press")}
MINI.sealring={
  who:"seneca",land:"l2",title:"A Steady Hand",short:true,art:K,stages:["At Court"],
  setup:["Near great power, everything shakes. The moods change by the minute.","My job was to keep a steady hand while the room shook."],
  how:"Turn the ring slowly until the ship stands upright. Don’t rush it.",
  win:"Six letters, all sealed straight. The mood never got into my hand.",
  walk:"Keep the ring. Steadiness is a skill, and you just practiced it.",
  lines:[null],pad:true,ab:false,bloomT:2,limit:90,
  fl:["Six letters sealed","A calm hand","Never rushed"],flNext:["Turn the ring slowly.","Small, slow turns, even when the room shakes."],
  rate:s=>s.tremble===0?3:s.tremble<=3?2:1,
  shotReady:s=>s.seals>=3&&!s.busy,
  init(s){Object.assign(s,{st:0,stT:0,T:0,dt:.016,a:kn(),U:0,acc:0,hist:[[0,0]],tr:0,tremble:0,md:md(),mc:0,fl:{t:9,k:0},seals:0,busy:0,q:0,rs:0,fp:null,hd:0,hs:0,ap:null,H:mHold({dur:.6})})},
  step(s,dt,inp){s.T+=dt;s.stT+=dt;s.dt=dt;s.fl.t+=dt;const b=s.busy;
    if(b){s.q+=dt;if(s.seals>=6&&s.q>=.9)return"win";if(s.q>=.9&&!s.rs){s.rs=1;s.a=kn()}if(s.q>=1.7)s.busy=0}
    else{s.md-=dt;if(s.md<=0){s.a=wr(s.a+kn());s.fl={t:0,k:Math.random()<.5};s.md=md();s.mc++;sfx("seal_mood")}} /* a court mood only turns the ring */
    if(s.tr>0){s.tr-=dt;if(s.tr<=0)s.hist=[[s.T,s.U]]}
    const f=inp.down,ph=f&&Math.hypot(f.x-CX,f.y-CY)>=8?Math.atan2(f.y-CY,f.x-CX):null,ok=!b&&s.tr<=0;
    if(ok){if(ph!=null){if(s.fp!=null)turn(s,wr((ph-s.fp)/D))}
      else if(inp.dx){const g=Math.sign(inp.dx);s.hd=g===s.hs?s.hd+dt:0;s.hs=g;turn(s,inp.dx*(70+190*Math.min(1,s.hd/.7))*dt)}else s.hd=s.hs=0}else s.hd=s.hs=0;
    s.fp=ph;s.hist.push([s.T,s.U]);while(s.hist.length>1&&s.hist[1][0]<=s.T-SK)s.hist.shift();
    const e=s.hist[0],w=s.T-e[0]>=SK-.011?Math.abs(s.U-e[1])/(s.T-e[0]):0; /* turn speed over the last 0.15 s */
    if(ok&&w>200){s.tr=.8;s.tremble++;sfx("seal_tremble");s.hist=[[s.T,s.U]];s.hd=s.hs=0}
    if(s.H.step(dt,inp,!s.busy&&s.tr<=0&&Math.abs(s.a)<=Z)==="full")press(s);
    return null},
  draw(s,c,t){back(c);gradeN(c,"night",.6);vignette(c,.6);const q=s.busy?s.q:9,fl=s.rm?.5:.5+.4*Math.sin(t/90)*Math.sin(t/37),bd=s.busy||s.md>.6?0:1-s.md/.6;
    glow(c,96,60,56,"#F5C66A",.2+.1*fl);chair(c,96,56,1.5,1);
    if(s.fl.t<.8){const u=s.fl.t/.8,x=96,y=56;if(s.fl.k){glow(c,x,y,70,"#FFE9A0",.6*(1-u));c.strokeStyle="#FFE9A0";c.globalAlpha=1-u;c.lineWidth=1;c.beginPath();for(let i=0;i<8;i++){c.moveTo(x+Math.cos(i*.785)*26,y+Math.sin(i*.785)*26);c.lineTo(x+Math.cos(i*.785)*38,y+Math.sin(i*.785)*38)}c.stroke()}
      else{c.fillStyle=`rgba(8,5,14,${.6*(1-u)})`;c.beginPath();c.arc(x,y,42,0,7);c.fill();c.strokeStyle="#100B15";c.globalAlpha=1-u;c.lineWidth=3;c.beginPath();c.moveTo(80,46);c.lineTo(94,54);c.moveTo(112,46);c.lineTo(98,54);c.stroke()}
      c.strokeStyle="#9AA0AA";c.globalAlpha=1-u;c.lineWidth=1;for(let i=0;i<8;i++){const r=s.rm?44:12+u*50,a=i*.785+.2;c.beginPath();c.arc(x,y,r,a,a+.4);c.stroke()}c.globalAlpha=1}
    if(!mPiece(c,K,"lamp",40,190,{ax:.5,ay:1,sc:2})){c.fillStyle="#8A6A2A";c.fillRect(30,180,20,8)}
    glow(c,32,167,14+3*fl,"#FFC860",.5);c.fillStyle="#FFD27A";c.beginPath();c.moveTo(30.5,172);c.lineTo(32+bd*6,165-2*(1-bd));c.lineTo(33.5,172);c.fill();
    let dx=96,dy=170,sx=1,sy=1,sl=0;
    if(s.busy){if(q<.35)sl=1.4-.4*E.out(q/.35);else{const u=clamp((q-.35)/.55,0,1);sl=1;sy=1-.86*clamp(u/.4,0,1);sx=1-.4*(1-sy)/.86;dx=lerp(96,168,E.inOut(clamp((u-.3)/.7,0,1)));dy=lerp(170,212-7*(s.seals-1),E.inOut(clamp((u-.3)/.7,0,1)))}}
    if(!s.busy||q<.9)docu(c,dx,dy,sx,sy,1,sl);
    if(s.busy&&q>=.9&&s.seals<6){const u=E.out((q-.9)/.8);docu(c,s.rm?96:lerp(-30,96,u),170,1,1,s.rm?u:1,0)}
    const n=s.seals-(s.busy&&q<.9?1:0);for(let i=0;i<n;i++)roll(c,168,212-7*i,0);
    sen(c,24,226,s.rm?"sen_idle_0":Math.floor(t/600)%2?"sen_idle_1":"sen_idle_0");
    const rot=(s.a+(s.tr>0&&!s.rm?8*(Math.sin(t/16)>0?1:-1):0))*D;
    if(!mPiece(c,K,"ring",CX,CY+(s.busy&&q<.15?3:0),{ax:.5,ay:.5,rot,sm:true})){c.save();c.translate(CX,CY);c.rotate(rot);c.strokeStyle="#D9A93A";c.lineWidth=4;c.beginPath();c.arc(0,0,12,0,7);c.stroke();c.fillStyle="#F5C66A";c.fillRect(-3,-14,6,6);c.restore()}
    c.fillStyle="#F5C66A";c.beginPath();c.moveTo(CX-3,CY-23);c.lineTo(CX+3,CY-23);c.lineTo(CX,CY-18);c.fill();
    if(s.tr>0){c.strokeStyle="#E8845A";c.lineWidth=1.5;c.beginPath();c.arc(CX,CY,25,-.5,.5);c.moveTo(CX-25*Math.cos(.5),CY+25*Math.sin(.5));c.arc(CX,CY,25,Math.PI-.5,Math.PI+.5);c.stroke()}
    s.H.draw(c,CX,CY,21,"#F5C66A")},
  bloom(s,c,k,t){const f=s._fl||1;back(c);gradeN(c,"night",.6*(1-.6*k));vignette(c,.6*(1-.7*k));
    c.fillStyle=`rgba(235,240,255,${k})`;c.beginPath();c.arc(150,36,8,0,7);c.fill();glow(c,150,36,36+12*f,"#DDE8FF",k*(.25+.12*f));shaft(c,150,40,140,50,.25,"#CFE0FF",k*.1*f);
    chair(c,96,56,1.5-.7*k,.85*(1-k));glow(c,96,100,34,"#F5C66A",k*(.4+.15*f));
    for(let i=0;i<6;i++)roll(c,96,119-7*i,k*.2*f);sen(c,130,118,"sen_calm")},
  auto(s,inp){if(s.busy||s.tr>0||Math.abs(s.a)<=3){s.ap=null;return}
    s.ap=(s.ap==null?0:s.ap+(s.a>0?-1:1)*120*D*s.dt);inp.down={x:CX+30*Math.cos(s.ap),y:CY+30*Math.sin(s.ap)}}
};
}
})();
/* GAME:sealring:END */
/* GAME:chain:BEGIN */
(function(){
{
/* The Free Mind (chain): Epictetus, “A Broken Chain”. Helper: none (own grid, BFS, input). Art key epictetus_s. */
const K="epictetus_s",M=["###E###","#....3#","#.###c#","#.#2..#","####b##","#.....#","#1###a#","##....#","###S###"],
  X=12,Y=24,C=24,D=[[0,-1,"up"],[1,0,"right"],[0,1,"down"],[-1,0,"left"]],GT=" abc";
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("chain_clink",()=>{aTone(AN(31),.08,{type:"triangle",v:.03,lp:3400});aTone(AN(38),.1,{v:.018,at:.035})});
V("chain_light",()=>{aNoise(.3,{f:500,to:2400,q:2,v:.04,a:.1});aTone(AN(19),.25,{v:.025,to:AN(26)})});
V("chain_lever",()=>{aNoise(.07,{f:900,q:3,v:.07});aTone(AN(-5),.1,{type:"square",v:.025,lp:700,at:.07})});
V("chain_gate",()=>{aNoise(.5,{f:260,to:700,q:1.2,v:.06,a:.1});aTone(AN(-14),.45,{type:"sawtooth",v:.02,lp:500,to:AN(-9)})});
V("chain_snap",()=>{aTone(AN(36),.18,{type:"triangle",v:.06,lp:4000});aTone(AN(43),.3,{v:.035,at:.06});aNoise(.06,{type:"highpass",f:4000,v:.05})});
const ch=(x,y)=>M[y]&&M[y][x]||"#",ci=(x,y)=>y*7+x,cx=x=>X+x*C+12,cy=y=>Y+y*C+12,G=h=>"abc".includes(h);
const ok=(s,x,y,b)=>{const h=ch(x,y);return h!=="#"&&!(b&&G(h)&&!s.go[h])};
const vp=o=>{const m=o.m||[o.x,o.y],t=o.m?clamp(o.k/o.sp,0,1):0;return[lerp(cx(o.x),cx(m[0]),t),lerp(cy(o.y),cy(m[1]),t)]};
const near=(o,x,y)=>Math.abs(o.x-x)<=1&&Math.abs(o.y-y)<=1,vis=(s,x,y)=>near(s.B,x,y)||(s.on||s.rt>0)&&near(s.L,x,y);
function route(s,x,y,gx,gy,b,sn){const p={},q=[[x,y]];p[ci(x,y)]=-1;
  for(let i=0;i<q.length;i++){const a=q[i][0],e=q[i][1];if(a===gx&&e===gy){const r=[];let k=ci(a,e);while(p[k]!==-1){r.unshift([k%7,k/7|0]);k=p[k]}return r}
    for(const d of D){const n=a+d[0],m=e+d[1],k=ci(n,m);if(p[k]===undefined&&ok(s,n,m,b)&&(!sn||s.sn[k])){p[k]=ci(a,e);q.push([n,m])}}}
  return null}
function see(s,o){for(let i=-1;i<2;i++)for(let j=-1;j<2;j++){const a=o.x+i,e=o.y+j;if(a>=0&&a<7&&e>=0&&e<9)s.sn[ci(a,e)]=1}}
function arrive(s,o,b){const h=ch(o.x,o.y);
  if(/\d/.test(h)&&!s.go[GT[h]]){s.go[GT[h]]=1e-6;sfx("chain_lever");sfx("chain_gate");pSparks(s.P,cx(o.x),cy(o.y),8,"#F5C66A",30)}
  if(b&&h==="E"){s.fin=.7;sfx("chain_snap");if(!s.rm)pSparks(s.P,cx(o.x),cy(o.y)+8,10,"#DDE4F0",40)}}
function nxt(s,o,hd){if(s.q.length){const e=s.q.shift(),d=D.findIndex(v=>v[0]===e[0]-o.x&&v[1]===e[1]-o.y);if(d<0)s.q=[];return d}
  if(s.pd>=0){const d=s.pd;s.pd=-1;return d}return hd}
function tick(s,o,dt,b,act,hd){let cr=0;const was=!o.m;
  if(o.m){o.k+=dt;if(o.k<o.sp)return;cr=o.k-o.sp;o.x=o.m[0];o.y=o.m[1];o.m=null;arrive(s,o,b)}
  o.k=0;if(!act||s.fin>0)return;
  const d=nxt(s,o,hd);if(d<0)return;const n=o.x+D[d][0],m=o.y+D[d][1];
  if(!ok(s,n,m,b)){s.q=[];if(b&&G(ch(n,m)))s.nb=.3,s.bx=[n,m];return}
  o.m=[n,m];o.d=d;o.k=was?dt:cr;if(b){s.steps++;sfx("chain_clink")}}
const pp=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];return !!(r&&v)&&mPerson(c,K,n,x,y,Object.assign({ax:v[0]/r[2],ay:1},o))};
function back(c){if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,276);g.addColorStop(0,"#16314A");g.addColorStop(1,"#2B3E4A");c.fillStyle=g;c.fillRect(0,0,192,320);
  c.fillStyle="#0B0A12";c.fillRect(0,276,192,44);c.fillStyle="#4C4A52";c.fillRect(122,80,70,196);c.fillStyle="#E8E2C8";c.beginPath();c.arc(64,38,9,0,7);c.fill()}
  gradeN(c,"night",.7)}
function cells(s,c,al){for(let y=0;y<9;y++)for(let x=0;x<7;x++){let px=X+x*C,py=Y+y*C;const h=ch(x,y),v=vis(s,x,y);
  if(!s.sn[ci(x,y)]){c.globalAlpha=al;c.fillStyle="#000";c.fillRect(px,py,C,C);continue}
  c.globalAlpha=al*(v?1:.5);
  if(h==="#"){c.fillStyle="#26222E";c.fillRect(px,py,C,C);if(!mPiece(c,K,"wall",px,py)){c.fillStyle="#5A5A66";c.fillRect(px+1,py+1,C-2,C-2)}continue}
  c.fillStyle=(x+y)&1?"#46525F":"#3E4A58";c.fillRect(px,py,C,C);
  if(h==="E"){c.fillStyle="#F5C66A";c.globalAlpha*=.45;c.fillRect(px+4,py+2,16,22);c.globalAlpha=al*(v?1:.5)}
  if(G(h)){const p=s.go[h]||0,n=h.charCodeAt(0)-96;if(s.nb>0&&!s.rm&&s.bx[0]===x&&s.bx[1]===y)px+=Math.sin(s.nb*90)*1.5;
    if(p>=1){if(!mPiece(c,K,"gate_open",px,py)){c.fillStyle="#3A3A44";c.fillRect(px+2,py,20,4)}}
    else{c.save();c.beginPath();c.rect(px,py,C,C);c.clip();
      if(!mPiece(c,K,"gate_shut",px,py-C*p)){c.fillStyle="#3A3A44";for(let i=0;i<5;i++)c.fillRect(px+3+i*4.5,py+2-C*p,2,20)}c.restore()}
    c.fillStyle="#F5C66A";for(let i=0;i<n;i++)c.fillRect(px+3+i*4,py+2,2,2)}
  if(/\d/.test(h)){const up=!s.go[GT[h]];if(!mPiece(c,K,up?"lever_up":"lever_down",px+12,py+22,{ax:.5,ay:1})){c.fillStyle="#7A5A38";c.fillRect(px+10,py+8,4,14)}
    c.fillStyle="#F5C66A";for(let i=0;i<+h;i++)c.fillRect(px+3+i*4,py+2,2,2)}}
  c.globalAlpha=1}
function actors(s,c,t){const B=s.B,p=vp(B),x=p[0],y=p[1]+10;mShadow(c,x,y,12,.4);
  if(!pp(c,"epc_"+D[B.d][2]+"_"+(B.m&&B.k>B.sp/2?1:0),x,y)){c.fillStyle="#8A7A5A";c.fillRect(x-5,y-22,10,22);c.fillStyle="#E0B890";c.fillRect(x-3,y-22,6,6)}
  if(s.fin>0&&!mPiece(c,K,"chain",x,y+1,{ax:.5,ay:1})){c.fillStyle="#9AA0B0";c.fillRect(x-6,y-1,12,2)}
  if(s.on||s.rt>0){const q=s.on?vp(s.L):[lerp(s.rp[0],x,E.out(1-s.rt/.3)),lerp(s.rp[1],p[1],E.out(1-s.rt/.3))],lx=q[0],ly=q[1]+(s.rm?0:Math.sin(t/200));
    glow(c,lx,ly,20,"#F5C66A",.35);glow(c,lx,ly,8,"#FFF1C8",1);c.fillStyle="#FFF8E0";c.fillRect(lx-1,ly-3,2,6);c.fillRect(lx-3,ly-1,6,2)}}
MINI.chain={
  who:"epictetus",land:"l2",title:"The Free Mind",short:true,art:K,stages:["Body and Mind"],map:M,
  setup:["They can chain a body. They can’t chain what you think.","My body is slow down here. My mind isn’t. Let’s use it."],
  how:"Press B to send your thoughts ahead. Find the levers, then walk.",
  win:"The chain was always on my leg, never on my mind.",walk:"Keep the chain. It’s only iron now.",
  lines:[null],pad:true,ab:true,bloomT:2,limit:90,
  fl:["The chain is broken","Few wasted steps","Your mind found the way first"],
  flNext:["Scout with the light before the body moves.","Flip every lever before you take a step."],
  rate:s=>s.steps<=14?3:s.steps<=20?2:1,
  shotReady:s=>s.steps>=7,
  init(s){s.st=0;s.stT=0;const o=(sp)=>({x:3,y:8,sp,k:0,m:null,d:0});
    Object.assign(s,{B:o(.7),L:o(.12),go:{a:0,b:0,c:0},sn:new Array(63).fill(0),steps:0,on:false,rt:0,rp:[0,0],q:[],pd:-1,fin:0,nb:0,bx:[0,0],P:pfx()});see(s,s.B)},
  step(s,dt,inp){const B=s.B,L=s.L;s.stT+=dt;pStep(s.P,dt,s.rm);s.nb-=dt;
    for(const g in s.go)if(s.go[g]>0&&s.go[g]<1)s.go[g]=Math.min(1,s.go[g]+dt*2);
    if(s.fin>0){s.fin-=dt;return s.fin<=0?"win":null}
    if(s.rt>0)s.rt=Math.max(0,s.rt-dt);
    if(inp.bTap&&!(s.rt>0)){s.q=[];s.pd=-1;
      if(s.on){s.rp=vp(L);s.on=false;s.rt=.3;L.m=null;L.k=0}else{s.on=true;L.x=B.x;L.y=B.y;L.m=null;L.k=0;pSparks(s.P,cx(B.x),cy(B.y),5,"#FFF1C8",25)}sfx("chain_light")}
    const A=s.on?L:B,tp=(inp.taps||[]).slice(-1)[0];
    if(tp){const tx=Math.floor((tp.x-X)/C),ty=Math.floor((tp.y-Y)/C);
      if(tx>=0&&tx<7&&ty>=0&&ty<9&&s.sn[ci(tx,ty)]){const m=A.m||[A.x,A.y],r=route(s,m[0],m[1],tx,ty,!s.on,1);if(r&&r.length){s.q=r;s.pd=-1}}}
    const sw={left:3,right:1,up:0,down:2}[inp.swipe],kd=inp.lTap?3:inp.rTap?1:inp.uTap?0:inp.dTap?2:sw!=null?sw:-1,ax=Math.abs(inp.dx),ay=Math.abs(inp.dy),
      hd=Math.max(ax,ay)>.3?(ax>ay?(inp.dx<0?3:1):(inp.dy<0?0:2)):-1;
    if(kd>=0){s.pd=kd;s.q=[]}if(hd>=0)s.q=[];
    tick(s,B,dt,1,!s.on,hd);if(s.on)tick(s,L,dt,0,1,hd);
    see(s,B);if(s.on||s.rt>0)see(s,L);return null},
  draw(s,c,t){back(c);cells(s,c,1);actors(s,c,t);pDraw(c,s.P,K)},
  bloom(s,c,k,t){const f=s._fl||1,m=1-E.out(Math.min(1,k*2)),e=E.out(clamp(k*3,0,1)),a=clamp((k-.5)/.3,0,1),fr=s.rm?0:Math.floor(t/500)%2;back(c);if(m>0)cells(s,c,m);
    c.save();c.globalAlpha=e;c.fillStyle="#100B15";c.beginPath();c.moveTo(68,48);c.lineTo(68,30);c.arc(96,30,28,Math.PI,0);c.lineTo(124,48);c.fill();
    const g=c.createLinearGradient(0,6,0,48);g.addColorStop(0,"#E8B65A");g.addColorStop(1,"#C98A3A");c.fillStyle=g;c.globalAlpha=e*(.5+.08*f);
    c.beginPath();c.moveTo(72,48);c.lineTo(72,30);c.arc(96,30,24,Math.PI,0);c.lineTo(120,48);c.fill();c.restore();glow(c,96,36,28+8*f,"#FFC860",e*(.14+.06*f));
    pp(c,"stud0_"+fr,79,47,{a});pp(c,"stud1_"+fr,113,47,{a});mShadow(c,96,47,12,.4*e);
    if(!pp(c,"epc_down_0",96,47,{a:e})){c.fillStyle="#8A7A5A";c.fillRect(91,26,10,21)}
    if(!mPiece(c,K,"chain",96,48,{ax:.5,ay:1,a:e})){c.fillStyle="#9AA0B0";c.fillRect(90,47,12,2)}
    const u=clamp((k-.1)/.4,0,1);glow(c,96,lerp(8,38,E.inOut(u)),8,"#FFF1C8",1-clamp((k-.5)/.15,0,1));glow(c,96,38,14,"#FFE9B8",(.2+.08*f)*a)},
  auto(s,inp){if(s.fin>0)return;const n=(s.go.a>0)+(s.go.b>0)+(s.go.c>0);
    const go=(o,gx,gy,b)=>{const m=o.m||[o.x,o.y],r=route(s,m[0],m[1],gx,gy,b);if(r&&r.length){inp.dx=r[0][0]-m[0];inp.dy=r[0][1]-m[1]}};
    if(n<3){if(!s.on){inp.bTap=true;return}const t=[[1,6],[3,3],[5,1]][!s.go.a?0:!s.go.b?1:2];go(s.L,t[0],t[1],0)}
    else if(s.on)inp.bTap=true;else go(s.B,3,0,1)}
};
}
})();
/* GAME:chain:END */
/* GAME:crutch:BEGIN */
(function(){
{
/* Use What Falls (crutch): Epictetus, “A Wooden Crutch”. Helper: none (own grid and input). Art key epictetus_s. */
const K="epictetus_s",ORD=[1,1,2,1,2,1,1,1,2,1,2,1,1,2,1,1],PLAN=[3,4,3,2,3,4,1,2,0,4,1,3],BY=232,MINH=1,TX=1.1; /* MINH: he steps only onto a column of at least this height (1 = a stone to stand on; 0 = the brief's literal wording) */
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("crutch_drop",()=>{aNoise(.14,{f:300,to:120,q:.7,v:.1,a:.01});aTone(AN(-24),.15,{v:.07,lp:300,to:AN(-30)})});
V("crutch_step",()=>{aTone(AN(-2),.07,{type:"triangle",v:.05,lp:900});aNoise(.05,{f:1800,q:2,v:.03})});
V("crutch_hole",()=>{aTone(AN(-17),.25,{v:.07,lp:380,to:AN(-22)});aNoise(.12,{f:260,q:3,v:.04,at:.02})});
V("crutch_door",()=>{aTone(AN(12),.9,{type:"triangle",v:.05,lp:2600});aTone(AN(19),.9,{type:"triangle",v:.03,lp:2600,at:.12})});
const px=c=>36+24*c,wd=s=>ORD[s.i%16],rdy=s=>!s.fl&&!s.wk&&!s.mv&&!(s.fin>0);
const lv=(s,c,w)=>w>1?Math.max(s.h[c],s.h[c+1]):s.h[c];
const pp=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];return !!(r&&v)&&mPerson(c,K,n,x,y,Object.assign({ax:v[0]/r[2],ay:1},o))};
function back(c){if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,276);g.addColorStop(0,"#16314A");g.addColorStop(1,"#2B3E4A");c.fillStyle=g;c.fillRect(0,0,192,320);
  c.fillStyle="#0B0A12";c.fillRect(0,276,192,44);c.fillStyle="#4C4A52";c.fillRect(122,80,70,196);c.fillStyle="#E8E2C8";c.beginPath();c.arc(64,38,9,0,7);c.fill()}}
function stone(c,w,x,y,a){if(!mPiece(c,K,w>1?"slab":"block",x,y,{a})){c.save();c.globalAlpha=a;c.fillStyle=w>1?"#C9B79A":"#B8A58A";c.fillRect(x+.5,y+.5,24*w-1,23);c.strokeStyle="#6A5A48";c.strokeRect(x+.5,y+.5,24*w-1,23);c.restore()}}
function stair(s,c){s.pc.forEach(p=>stone(c,p[1],24+24*p[0],BY-24*(p[2]+1),1));c.fillStyle="rgba(5,3,10,.8)";s.hl.forEach(q=>c.fillRect(24+24*q[0],BY-24*q[2],24,24*(q[2]-q[1])))}
function land(s,f){const H=s.h,c=f.c;let L=lv(s,c,f.w);
  if(f.w<2){H[c]++;s.pc.push([c,1,L])}
  else{const d=Math.abs(H[c]-H[c+1]);if(d){s.holes+=d;s.hl.push([H[c]<H[c+1]?c:c+1,Math.min(H[c],H[c+1]),L]);sfx("crutch_hole")}H[c]=H[c+1]=L+1;s.pc.push([c,2,L])}
  sfx("crutch_drop");pDust(s.P,24+24*c+12*f.w,BY-24*L,6)}
function epi(s,c,t){const e=s.e,H=s.h,p=s.mv/TX,x=lerp(px(e),px(Math.min(5,e+1)),p),up=s.mv>0&&H[e+1]>H[e],
    y=lerp(BY-24*H[e],BY-24*H[Math.min(5,e+1)],E.inOut(clamp((p-.3)/.45,0,1)));mShadow(c,x,y,12,.4);
  const n=s.mv>0?(up&&p>.3&&p<.75?"epc_cr_step":"epc_cr_walk_"+(Math.floor(p*4)%2)):"epc_cr_idle_"+(s.rm?0:Math.floor(t/600)%2);
  if(!pp(c,n,x,y)){c.fillStyle="#8A7A5A";c.fillRect(x-5,y-22,10,22);c.fillStyle="#E0B890";c.fillRect(x-3,y-22,6,6)}}
function door(c,a){glow(c,150,66,20,"#FFC860",a)}
MINI.crutch={
  who:"epictetus",land:"l2",title:"Use What Falls",short:true,art:K,stages:["One Step at a Time"],
  setup:["My leg manages one step at a time. Up or down, just one.","I don’t choose what falls from the hill. I do choose where it goes."],
  how:"Tap a column to drop the stone there. Build me a stair.",
  win:"Lameness slows the leg. It never touched my choices.",walk:"Keep the crutch. Lean on what helps, and choose the rest.",
  lines:[null],pad:true,ab:true,bloomT:2,limit:90,
  fl:["Up to the door","A sturdy stair","Not one stone wasted"],
  flNext:["Drop slabs on two columns of the same height.","Plan ahead for the slabs."],
  rate:s=>s.holes<1?3:s.holes<3?2:1,
  shotReady:s=>s.n>=4,
  init(s){s.st=0;s.stT=0;Object.assign(s,{h:[1,0,0,0,0,6],e:0,mv:0,i:0,n:0,holes:0,cur:2,hr:0,hd:0,fl:null,wk:0,fin:0,hl:[],P:pfx(),pc:[[0,1,0]].concat([0,1,2,3,4,5].map(i=>[5,1,i]))})},
  step(s,dt,inp){s.stT+=dt;pStep(s.P,dt,s.rm);const H=s.h,f=s.fl;
    if(s.fin>0){s.fin-=dt;return s.fin<=0?"win":null}
    if(f){if(!f.go){f.y=Math.min(f.ty,f.y+160*dt);if(f.y>=f.ty){if(f.roll){f.go=1;f.vx=(f.c>0?-70:70);f.vy=0}else{land(s,f);s.fl=null;s.wk=1}}}
      else{f.x+=f.vx*dt;f.vy+=300*dt;f.y+=f.vy*dt;if(f.y>280){s.fl=null;s.wk=1}}}
    else if(s.mv>0){s.mv+=dt;if(s.mv>=TX){s.e++;s.mv=0;if(s.e>=5){s.fin=.6;sfx("crutch_door")}}}
    if(!s.fl&&!s.mv&&s.wk&&!(s.fin>0)){const e=s.e;if(e<5&&Math.abs(H[e+1]-H[e])<=1&&H[e+1]>=MINH){s.mv=1e-6;sfx("crutch_step")}else s.wk=0}
    const h=Math.abs(inp.dx)>.3?Math.sign(inp.dx):0,tp=(inp.taps||[]).slice(-1)[0];let m=inp.lTap?-1:inp.rTap?1:0,dr=inp.aTap;
    if(h){if(h!==s.hd){s.hd=h;s.hr=.3;if(!m)m=h}else if((s.hr-=dt)<=0){s.hr=.2;m=h}}else s.hd=0;
    if(m)s.cur=clamp(s.cur+m,0,4);
    if(tp){const c=Math.floor((tp.x-24)/24);if(c>=0&&c<5){s.cur=c;dr=true}}
    if(dr&&rdy(s)){const w=wd(s),c=Math.min(s.cur,w>1?3:4),L=lv(s,c,w);s.fl={c,w,x:24+24*c,y:40,ty:BY-24*(Math.min(L,7)+1),roll:L>=7};s.i++;s.n++}
    return null},
  draw(s,c,t){back(c);door(c,.35+(s.fin>0?.3:0));stair(s,c);epi(s,c,t);const w=wd(s),cl=Math.min(s.cur,w>1?3:4),sw=s.rm?0:Math.sin(t/420)*1.5,r=rdy(s);
    c.fillStyle="rgba(245,198,106,.12)";c.fillRect(24+24*cl,64,24*w,BY-64);
    if(r){const L=lv(s,cl,w);c.strokeStyle="rgba(255,233,184,.6)";c.setLineDash([2,2]);c.strokeRect(24.5+24*cl,BY-24*(Math.min(L,7)+1)+.5,24*w-1,23);c.setLineDash([])}
    if(s.fl)stone(c,s.fl.w,s.fl.x,s.fl.y,1);else if(!(s.fin>0))stone(c,w,24+24*cl+sw,40+sw/2,r?1:.35);
    for(let i=1,x=6;i<4;i++){const q=ORD[(s.i+i)%16];c.fillStyle="#C9B79A";c.fillRect(x,8,q*10-1,9);x+=q*10+3}
    pDraw(c,s.P,K)},
  bloom(s,c,k,t){const f=s._fl||1,p=clamp(k/.45,0,1),a=clamp((k-.6)/.25,0,1),fr=s.rm?0:Math.floor(t/500)%2;back(c);door(c,.3+.12*f);stair(s,c);
    c.save();c.fillStyle="#F5C66A";s.pc.forEach(q=>{c.globalAlpha=clamp((k*1.2-.15-q[2]*.1)/.15,0,1)*(.25+.12*f);c.fillRect(24+24*q[0],BY-24*(q[2]+1),24*q[1],24)});c.restore();
    pp(c,"stud0_"+fr,136,80,{a});pp(c,"stud1_"+fr,166,80,{a});
    if(k<.55){const x=lerp(156,150,p),y=lerp(88,78,p);mShadow(c,x,y,12,.4);if(!pp(c,"epc_cr_walk_"+(Math.floor(p*3)%2),x,y,{flip:true})){c.fillStyle="#8A7A5A";c.fillRect(x-5,y-22,10,22)}}
    else{mShadow(c,150,78,14,.4);if(!pp(c,"epc_cr_sit",150,78)){c.fillStyle="#8A7A5A";c.fillRect(145,60,10,18)}}
    if(k>=.45&&!mPiece(c,K,"crutch",141,78,{ax:.5,ay:1,rot:.2,a:clamp((k-.45)/.1,0,1)})){c.fillStyle="#8A6A38";c.fillRect(140,56,2,22)}
    glow(c,150,70,12,"#FFE9B8",.12*f*a)},
  auto(s,inp){if(rdy(s)){const t=s.n<PLAN.length?PLAN[s.n]:4;inp.taps=[{x:px(t),y:150}];inp.tap=inp.taps[0]}}
};
}
})();
/* GAME:crutch:END */
/* GAME:morning:BEGIN */
(function(){
/* Morning Reminder (morning). Marcus, "A Private Notebook". Helper: mHold. */
{
const K="marcus_s",TK=["firewood","bucket","rope"],CO=["#C2415A","#6F8FBF","#D9A93A","#7A5AA0","#4F8E5A","#8A8A92"];
const SP=[[78,148],[86,136],[20,150],[36,164],[72,162],[10,138]],MX=52,MY=150,VX=104,VY=156,FR=[62,157],BU=[106,110],NEED=.7,SPD=90;
if(typeof SFX!=="undefined"&&!SFX.morning_breath){
  SFX.morning_breath=()=>aNoise(1.3,{f:500,to:1500,q:.6,a:.9,v:.04});
  SFX.morning_peak=()=>aTone(AN(30),.05,{v:.04,type:"triangle"});
  SFX.morning_calm=()=>[-12,-5,0].forEach((n,i)=>aTone(AN(n),.9,{v:.06-i*.01,lp:1100,a:.06}));
  SFX.morning_snap=()=>aNoise(.05,{type:"highpass",f:2600,q:1,v:.07});
  SFX.morning_task=()=>{aNoise(.08,{f:500,to:300,q:1,v:.07});aTone(AN(-17),.1,{type:"triangle",v:.07,lp:500})}}
const pr=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],p=A&&A.pivots&&A.pivots[n];return !!(r&&p&&mPerson(c,K,n,x,y,Object.assign({ax:p[0]/r[2],ay:1},o)))};
const man=(c,n,x,y,col)=>{mShadow(c,x,y,12,.35);if(pr(c,n,x,y))return;c.fillStyle="#100B15";c.fillRect(x-7,y-17,14,17);c.fillStyle=col;c.fillRect(x-6,y-16,12,15);c.fillStyle="#E8C8A0";c.fillRect(x-3,y-22,6,6)};
const back=c=>{if(mBg(c,K,0))return;c.fillStyle="#AFC2D2";c.fillRect(0,0,192,100);c.fillStyle="#E4EAF0";c.fillRect(0,100,192,64);c.fillStyle="#6E8F94";c.fillRect(0,164,192,92);c.fillStyle="#2A3040";c.fillRect(0,258,192,62);
  c.fillStyle="#7A5A44";c.beginPath();c.moveTo(10,132);c.lineTo(53,58);c.lineTo(96,132);c.fill()};
function vis(c,v,t){const m=v.m,w=m==="walk"?"walk_"+(t/160%2|0):m==="carry"?"carry_"+(t/(v.w?450:200)%2|0):m;
  man(c,"v"+v.k+"_"+w,hs(v.x+(v.sb>0?6*v.sb/.35:0)),v.y,CO[v.k]);
  if(m==="carry"&&!v.nl&&!mPiece(c,K,TK[v.k%3],v.x-8,v.y-9,{ax:.5,ay:.5})){c.fillStyle="#8A6A48";c.fillRect(v.x-11,v.y-12,7,6)}}
function bub(c,k,x,y,a){c.save();c.globalAlpha=a;c.fillStyle="#EFE6D6";c.strokeStyle=CO[k];c.lineWidth=1.2;c.beginPath();
  if(k===2)c.ellipse(x,y,4,5.5,0,0,7);else if(k===5)c.rect(x-4.5,y-4.5,9,9);else if(k===1)c.arc(x,y,4.5,0,7);
  else for(let i=0;i<=16;i++){const q=i/16*6.283,r=k===3?4.5+1.3*Math.sin(q*3):k===4?(i%2?3.2:5.8):4.5;c[i?"lineTo":"moveTo"](x+Math.cos(q)*r,y+Math.sin(q)*r)}
  c.closePath();c.fill();c.stroke();c.strokeStyle="#3A2A40";c.beginPath();
  if(k===0)for(let i=0;i<3;i++){c.moveTo(x-3+i*2.2,y-2.5);c.lineTo(x-1.2+i*2.2,y);c.lineTo(x-3+i*2.2,y+2.5)}
  else if(k===2){c.moveTo(x-4,y-5);c.lineTo(x-3,y-8.5);c.lineTo(x-1.5,y-5.5);c.lineTo(x,y-9.5);c.lineTo(x+1.5,y-5.5);c.lineTo(x+3,y-8.5);c.lineTo(x+4,y-5)}
  else if(k===4){c.moveTo(x-2.5,y-1.5);c.lineTo(x-1,y-1.5);c.moveTo(x+1.5,y-1.5);c.lineTo(x+3,y-1.5)}
  c.stroke();c.restore()}
function spike(c,x,y,r,col,lw,n){c.save();c.strokeStyle=col;c.lineWidth=lw;c.beginPath();for(let i=0;i<=n*2;i++){const q=i/n/2*6.2832,rr=i%2?r+2.5+r*.08:r;c[i?"lineTo":"moveTo"](x+Math.cos(q)*rr,y+Math.sin(q)*rr)}c.closePath();c.stroke();c.restore()}
const bk=s=>s.cur?(s.cur.k?2.2:2.8):2.2,pk=s=>s.cur&&s.cur.k<2?.9:.7;
function swell(s,c){for(const w of s.wv){const q=w.t/.8,a=1-q;c.save();c.globalAlpha=Math.max(0,a);
  if(w.k==="calm"){c.strokeStyle="#8FC8F0";c.lineWidth=2*a+.5;c.beginPath();c.arc(MX+4,138,90*w.t,0,7);c.stroke();c.strokeStyle="#F5C66A";c.beginPath();c.arc(MX+4,138,72*w.t,0,7);c.stroke()}
  else if(w.k==="snap"){c.strokeStyle="#FF6A2A";c.lineWidth=1.6;c.beginPath();for(let i=0;i<=24;i++){const r=(i%2?.8:1.15)*110*w.t;c[i?"lineTo":"moveTo"](MX+4+Math.cos(i/24*6.283)*r,138+Math.sin(i/24*6.283)*r)}c.stroke()}
  else{c.strokeStyle="#DDE8F0";c.lineWidth=1;c.setLineDash([2,3]);c.beginPath();c.arc(MX,140,14+14*q,0,7);c.stroke()}c.restore()}}
function scene(s,c,t,vs,mf){back(c);const L=vs.map(v=>[v.y,()=>vis(c,v,t)]);L.push([MY,()=>man(c,mf,MX,MY,"#8E3B5A")]);L.sort((a,b)=>a[0]-b[0]);L.forEach(q=>q[1]())}
MINI.morning={
  who:"marcus",land:"l2",title:"Morning Reminder",short:true,art:K,stages:["The Morning Visitors"],
  setup:["Every morning I remind myself: today I’ll meet rude, ungrateful, difficult people.","They’re still my kin. We were made to work together."],
  how:"Hold to breathe in. Let go when their words peak.",
  win:"None of them could make me their enemy. Now look, they’re all helping.",
  walk:"Keep the notebook. Read that reminder before breakfast.",
  lines:[null],pad:false,ab:true,bloomT:2,limit:90,
  fl:["Everyone is helping","A patient morning","Not one sharp word"],flNext:["Fill your breath before you answer.","Answer right at the peak."],
  rate:s=>s.snap+s.late===0?3:s.snap+s.late<=3?2:1,
  shotReady:s=>s.hp.length>=3&&!!s.cur&&s.cur.m==="provoke"&&s.pt>1.2,
  init(s){Object.assign(s,{st:0,stT:0,n:0,cur:null,gp:0,pt:0,pk:false,snap:0,late:0,hp:[],wv:[],ans:0,fz:0,rk:0,bd:null,P:pfx(),
    H:mHold({dur:1.4,onRelease:k=>{s.rk=k}})})},
  step(s,dt,inp){s.stT+=dt;pStep(s.P,dt,s.rm);s.wv=s.wv.filter(w=>(w.t+=dt)<.8);s.ans=Math.max(0,s.ans-dt);s.fz=Math.max(0,s.fz-dt);if(s.bd&&(s.bd.t+=dt)>.5)s.bd=null;
    const was=s.H.held,ev=s.H.step(dt,inp);if(s.H.held&&!was)sfx("morning_breath");
    let v=s.cur;if(!v&&s.n<6&&(s.gp-=dt)<=0){v=s.cur={k:s.n++,x:196,y:VY,m:"walk"};s.pt=0;s.pk=false}
    if(v&&v.m==="walk"){v.x=Math.max(VX,v.x-SPD*dt);if(v.x<=VX){v.m="provoke";s.pt=0;s.pk=false}}
    else if(v){v.sb=Math.max(0,(v.sb||0)-dt);s.pt+=dt;const B=bk(s),PK=pk(s);
      if(ev==="release"){
        if(s.rk<NEED){s.snap++;v.sb=.35;s.pt=0;s.pk=false;s.wv.push({k:"snap",t:0});sfx("morning_snap");pSparks(s.P,VX-6,VY-12,8,"#FF8A3A",50)}
        else if(s.pt>=B){s.hp.push(v);v.task=TK[v.k%3];v.m="soft";v.ct=0;v.sb=0;s.cur=null;s.gp=1.2;s.ans=.6;s.bd={k:v.k,t:0};s.wv.push({k:"calm",t:0});sfx("morning_calm");
          for(let i=0;i<10;i++)pAdd(s.P,{x:BU[0]+Math.random()*8-4,y:BU[1]+Math.random()*8-4,vx:Math.random()*14-7,vy:-8-Math.random()*14,life:.9,col:"#FFE9A8",s:1.5})}
        else s.wv.push({k:"fizz",t:0})}
      if(s.cur&&!s.pk&&s.pt>=B){s.pk=true;sfx("morning_peak")}
      if(s.cur&&s.pt>=B+PK){s.late++;s.fz=.5;s.pt=0;s.pk=false}}
    for(const h of s.hp){h.ct+=dt;if(h.m==="soft"&&h.ct>=.5){h.m="carry";h.w=false;h.rt=[[SP[h.k][0],160],SP[h.k]];sfx("morning_task");pSparks(s.P,h.x-8,h.y-9,5,"#E8C890",20)}
      if(h.m==="carry"&&!h.w){const q=h.rt[0],d=Math.hypot(q[0]-h.x,q[1]-h.y),m=SPD*dt;if(d<=m){h.x=q[0];h.y=q[1];h.rt.shift();if(!h.rt.length)h.w=true}else{h.x+=(q[0]-h.x)/d*m;h.y+=(q[1]-h.y)/d*m}}}
    return s.hp.length>=6&&s.hp.every(h=>h.m==="carry")?"win":null},
  draw(s,c,t){const v=s.cur,vs=s.hp.concat(v?[v]:[]);scene(s,c,t,vs,s.H.held?"mar_breathe":s.ans>0?"mar_answer":"mar_sit_"+(s.rm?0:t/700%2|0));
    if(v&&v.m==="provoke"){const B=bk(s),P=s.pk,r=P?24:6+18*Math.min(1,s.pt/B);if(P)glow(c,BU[0],BU[1],30,"#FFF1C8",.22);
      spike(c,BU[0],BU[1],r,P?"#FFF1C8":"#B8405A",P?(s.rm?2.4:1.8+Math.abs(Math.sin(t/90))*1.4):1,12);bub(c,v.k,BU[0],BU[1],1)}
    else if(s.bd)bub(c,s.bd.k,BU[0],BU[1],1-s.bd.t/.5);
    swell(s,c);pDraw(c,s.P,K);
    const k=s.H.k,r=10+12*k,col=s.fz>0?"#B05068":k>=NEED?"#F5C66A":"#9FD0E8",q=Math.PI*(1.4*NEED-.5);c.save();c.strokeStyle="rgba(255,244,214,.3)";c.lineWidth=1;c.beginPath();c.arc(MX,140,10,0,7);c.stroke();c.restore();
    if(s.fz>0&&!s.rm&&(t/70|0)%2)c.globalAlpha=.3;if(s.fz>0)ring(c,MX,140,r,1,col,2);if(k>0||s.H.held){s.H.draw(c,MX,140,r,col);c.strokeStyle=c.fillStyle=col;c.lineWidth=1.2;c.beginPath();c.moveTo(MX+Math.cos(q)*(r-3),140+Math.sin(q)*(r-3));c.lineTo(MX+Math.cos(q)*(r+3),140+Math.sin(q)*(r+3));c.stroke();if(k>=NEED){c.beginPath();c.arc(MX+Math.cos(q)*r,140+Math.sin(q)*r,2.4,0,7);c.fill()}}c.globalAlpha=1},
  bloom(s,c,k,t){const f=s._fl||MINI.morning.rate(s),u=E.out(k),w=s.rm?0:t/90,vs=SP.map((p,i)=>({k:i,x:p[0],y:p[1],m:"carry",w:true,nl:1}));
    scene(s,c,t,vs,"mar_write");
    glow(c,112,8,110,"#FFD890",(.5+.12*f)*u);[-.4,0,.4].forEach(a=>shaft(c,112,6,200,34,a,"#FFD890",(.08+.03*f)*u));
    glow(c,FR[0],FR[1]-4,16+f*5,"#FFB050",.5+(s.rm?0:Math.sin(w)*.08));
    c.fillStyle="#FFB347";c.beginPath();c.moveTo(FR[0]-4,FR[1]);c.lineTo(FR[0]-1,FR[1]-6-(s.rm?0:Math.sin(w*1.3)*1.5));c.lineTo(FR[0]+1,FR[1]-2);c.lineTo(FR[0]+3,FR[1]-7+(s.rm?0:Math.cos(w)*1.5));c.lineTo(FR[0]+5,FR[1]);c.fill();
    c.fillStyle="#2A2230";c.beginPath();c.arc(FR[0]+.5,FR[1]-9,5,0,Math.PI);c.fill();
    for(let j=0;j<8;j++){const q=(s.rm?0:t/1500)+j/8,y=q%1;c.fillStyle="rgba(120,112,130,"+Math.sin(Math.PI*y)*.6+")";c.beginPath();c.arc(FR[0],FR[1]-14-y*46,2+y*3,0,7);c.fill()}
    SP.forEach((p,i)=>{const o=i%3,a=clamp((k-.12-.06*i)/.3,0,1),e=E.inOut(a),px=p[0]-8,py=p[1]-9;
      if(o===0&&a<1)mPiece(c,K,"firewood",lerp(px,FR[0],e),lerp(py,FR[1]-4,e),{ax:.5,ay:.5});
      else if(o===1){mPiece(c,K,"bucket",lerp(px,FR[0]+9,e),lerp(py,FR[1]-16,e),{ax:.5,ay:.5,rot:-.9*e});if(a>=1&&!s.rm)for(let j=0;j<3;j++){c.fillStyle="#9FD0F0";c.fillRect(FR[0]+4,FR[1]-12+(t/60+j*4)%8,1,1.5)}}
      else if(o===2){const px2=p[0]<16?24:14;rope(c,p[0]-3,py,lerp(p[0]-3,px2,e),lerp(py,130,e),3,"#C9A66B",1)}});
    mPiece(c,K,"notebook",MX+3,MY-3,{ax:.5,ay:.5,sc:.75,sm:true});
    gradeN(c,"warm",(.12+.06*f)*u)},
  auto(s,inp){const v=s.cur;if(v&&v.m==="provoke"&&s.pt<bk(s)+pk(s)/2)inp.a=true}
};
}
})();
/* GAME:morning:END */
/* GAME:danube:BEGIN */
(function(){
/* Whatever Comes (danube). Marcus, "A River Stone from the Danube". Helper: mLanes (input and notes; the 8-unit window is spatial, checked here). Idea: whatever the river brings, the one act that is yours is to meet it now. */
{
const K="marcus_s",Y=[172,196,220],NOW=120,WIN=8,EZ=40,TAU=6.2832;
const NM=[["laurel","pouch","letter"],["ice","branch","cloud"]],SZ=[[14,10],[12,12],[12,9]];
if(typeof SFX!=="undefined"&&!SFX.danube_meet){
  SFX.danube_meet=l=>{aTone(AN([5,9,14][l|0]),.7,{v:.08,lp:1800,a:.01});aTone(AN([17,21,26][l|0]),.4,{v:.025,at:.03})};
  SFX.danube_early=()=>aTone(AN(-5),.07,{v:.04,lp:500,to:AN(-10)});
  SFX.danube_melt=()=>{aNoise(.3,{type:"highpass",f:3500,q:1,v:.04,a:.02});aNoise(.1,{type:"highpass",f:5000,q:1,v:.03,at:.12})};
  GAP.danube_meet=.06}
const phi=t=>32*(t+.35*9/TAU*(1-Math.cos(TAU*t/9)));
const rng=a=>()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
function seq(seed){const R=rng(seed),g=[],o=[];for(let i=0;i<12;i++){g.push(i%3);o.push(i%3)}
  const sh=a=>{for(let i=a.length-1;i>0;i--){const j=R()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};sh(g);sh(o);
  const kd=sh([...Array(24)].map((_,i)=>i%2)),gp=[...Array(23)].map(()=>.55+2.2*R()),sc=clamp(38/gp.reduce((a,b)=>a+b),.85,1.3),th=[];let a=3.3;
  kd.forEach((h,i)=>{if(i)a+=gp[i-1]*sc;let ln;do{ln=R()*3|0}while(th.some(q=>q.ln===ln&&a-q.a<.9));
    th.push({a,ln,h,k:h?o.pop():g.pop(),x:-99,m:-1,p:false})});return th}
const pr=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],p=A&&A.pivots&&A.pivots[n];mShadow(c,x,y,12,.3);
  return !!(r&&p&&mPerson(c,K,n,x,y,Object.assign({ax:p[0]/r[2],ay:1},o)))};
const mar=(c,n,x,y,o)=>{if(pr(c,n,x,y,o))return;c.fillStyle="#100B15";c.fillRect(x-7,y-21,14,21);c.fillStyle="#8E3B5A";c.fillRect(x-6,y-20,12,19);c.fillStyle="#E8C8A0";c.fillRect(x-3,y-26,6,6)};
const back=c=>{if(mBg(c,K,0))return;const g=c.createLinearGradient(0,0,0,160);g.addColorStop(0,"#9FB4C8");g.addColorStop(1,"#E8D4C0");c.fillStyle=g;c.fillRect(0,0,192,160);
  c.fillStyle="#E4EAF0";c.fillRect(0,100,192,64);c.fillStyle="#6E8F94";c.fillRect(0,164,192,92);c.fillStyle="#2A3040";c.fillRect(0,258,192,62);c.fillStyle="#3A4A52";c.beginPath();c.ellipse(140,224,17,8,0,0,7);c.fill()};
function thing(c,s,q,t){const x=hs(q.x),y=Y[q.ln]+(s.rm?0:Math.sin(t/400+q.a*3)*1.2),n=NM[q.h][q.k],m=q.m,sz=q.h?[[18,11],[20,15],[18,15]][q.k]:SZ[q.k];
  if(m<0||!q.h)glow(c,x,y,13,q.h?"#7FA0C0":"#FFD070",m<0?.35:.55*Math.max(0,1-m/1.5));
  let sc=1.3,rot=0,a=1;if(m>=0&&q.h){if(q.k===0){sc=Math.max(.2,1.3-m*1.8);wave(c,x-9,y+5,18+m*8,1.2,2,s.rm?0:m*7,0,"rgba(190,230,240,"+Math.max(0,.9-m*.5)+")",1)}
    else if(q.k===1)rot=Math.min(.7,m*1.8);else a=Math.max(0,1-m/1.8)}
  if(a<=0)return;if(!mPiece(c,K,n,x,y,{ax:.5,ay:.5,sc,rot,a,sm:true})){c.save();c.globalAlpha=a;c.fillStyle=q.h?"#7D8FA0":"#E8C060";c.strokeStyle="#100B15";c.beginPath();
    if(q.h)c.rect(x-sz[0]/2*sc,y-sz[1]/2*sc,sz[0]*sc,sz[1]*sc);else c.ellipse(x,y,sz[0]/2,sz[1]/2,0,0,7);c.fill();c.stroke();c.restore()}}
function tap(s,ln,x){s.rp.push({x,y:Y[ln],t:0,e:0});const q=s.th.find(q=>q.ln===ln&&q.m<0&&q.x>=NOW-EZ&&q.x<NOW-WIN);if(q){s.early++;s.rp[s.rp.length-1].e=1;sfx("danube_early")}}
function meet(s,q){q.m=0;s.met++;s.gt=.35;s.fx[q.ln]=.3;sfx("danube_meet",q.ln);
  if(!q.h)pSparks(s.P,q.x,Y[q.ln],8,"#FFE9A8",25);else if(q.k===0)sfx("danube_melt");else if(q.k===2)for(let i=0;i<8;i++)pAdd(s.P,{k:"line",x:q.x+Math.random()*10-5,y:Y[q.ln]+3,vx:0,vy:60,life:.7,col:"rgba(170,200,230,.8)",w:.6,fade:false})}
MINI.danube={
  who:"marcus",land:"l2",title:"Whatever Comes",short:true,art:K,stages:["The River Moves"],
  setup:["Time is a river. Things arrive, and the current carries them off.","Good or hard, I meet each one the same way: right now, as well as I can."],
  how:"Tap a lane as each thing reaches the line.",
  win:"Laurels, ice, letters, storms. All gone downstream. What stayed was how I met them.",
  walk:"Keep the stone. The river’s still running.",
  lines:[null],pad:true,ab:true,bloomT:2,limit:90,
  fl:["The river ran on","Met most of what came","Met it all, right on time"],flNext:["Tap as each thing touches the line.","Don’t reach for what hasn’t arrived yet."],
  rate:s=>s.met>=22&&s.early<=2?3:s.met>=18?2:1,
  shotReady:s=>s.pass>=10,
  init(s){Object.assign(s,{st:0,stT:0,met:0,early:0,pass:0,gt:0,q:[0,0,0],fx:[0,0,0],rp:[],th:seq(s.seed!=null?s.seed:(Math.random()*4e9)|0),P:pfx(),
    L:mLanes({xs:[0,0,0],hitY:0,speed:0,win:.45,keys:["u","r","d"]})});
    s.th.forEach(q=>{q.note=s.L.add(q.ln,q.a,q.h);q.note.th=q;q.x=NOW-phi(q.a)+phi(0)})},
  step(s,dt,inp){s.stT+=dt;const L=s.L,pd=[inp.dy<-.5,inp.dx>.5,inp.dy>.5],pn=[inp.uTap||pd[0]&&!s.q[0],inp.rTap||inp.aTap||pd[1]&&!s.q[1],inp.dTap||pd[2]&&!s.q[2]],px=[NOW,NOW,NOW];s.q=pd;
    for(const p of inp.taps||[]){const l=Y.findIndex(y=>Math.abs(p.y-y)<=12);if(l>=0){pn[l]=true;px[l]=p.x}}
    const r=L.step(dt,{uTap:pn[0],rTap:pn[1],dTap:pn[2],taps:[]});pStep(s.P,dt,s.rm);s.gt=Math.max(0,s.gt-dt);
    for(let i=0;i<3;i++)s.fx[i]=Math.max(0,s.fx[i]-dt);s.rp=s.rp.filter(p=>(p.t+=dt)<.7);
    for(const q of s.th){q.x=NOW-(phi(q.a)-phi(L.t));if(q.m>=0)q.m+=dt}
    for(const h of r.hits){const q=h.note.th;if(q&&Math.abs(q.x-NOW)<=WIN)meet(s,q);else{h.note.hit=false;tap(s,h.lane,px[h.lane])}}
    for(const l of r.wrong)if(l>=0)tap(s,l,px[l]);
    for(const q of s.th)if(!q.p&&q.x>NOW+WIN){q.p=true;s.pass++}
    s.th=s.th.filter(q=>q.x<205);
    return s.pass>=24?"win":null},
  draw(s,c,t){back(c);s.th.forEach(q=>{if(q.x>-12&&q.x<205)thing(c,s,q,t)});
    if(mArtOk(K)){c.save();c.beginPath();c.ellipse(141,226,19,9,0,0,7);c.clip();mBg(c,K,0);c.restore()}
    gradeN(c,"day",.3);
    c.save();c.strokeStyle="rgba(255,244,214,.14)";c.lineWidth=1;Y.forEach(y=>{c.beginPath();c.moveTo(0,y+12);c.lineTo(192,y+12);c.stroke()});c.restore();
    c.fillStyle="rgba(255,233,184,.85)";c.strokeStyle="#100B15";Y.forEach((y,i)=>{c.beginPath();[[0,-4,4,3,-4,3],[4,0,-3,4,-3,-4],[0,4,4,-3,-4,-3]][i].forEach((v,j,a)=>{if(j%2)return;j?c.lineTo(9+v,y+a[j+1]):c.moveTo(9+v,y+a[j+1])});c.closePath();c.fill();c.stroke()});
    const g=c.createLinearGradient(NOW-9,0,NOW+4,0);g.addColorStop(0,"rgba(245,198,106,0)");g.addColorStop(.7,"rgba(255,233,168,.7)");g.addColorStop(1,"rgba(245,198,106,0)");c.fillStyle=g;c.fillRect(NOW-9,163,13,74);
    c.fillStyle="rgba(255,244,214,.8)";c.fillRect(NOW-.5,163,1,74);
    Y.forEach((y,i)=>{if(s.fx[i]>0)glow(c,NOW,y,22,"#FFE9A8",s.fx[i]*2.5)});
    mar(c,s.gt>0?"mar_meet":"mar_idle_"+(s.rm?0:t/700%2|0),NOW,162);
    for(const p of s.rp){const k=p.t/.7;c.save();c.globalAlpha=1-k;c.strokeStyle=p.e?"#8FA0B0":"#DDEEF4";c.lineWidth=1;c.setLineDash(p.e?[2,2]:[]);c.beginPath();c.ellipse(p.x,p.y,3+(p.e?6:10)*k,1.5+(p.e?3:5)*k,0,0,7);c.stroke();c.restore()}
    pDraw(c,s.P,K)},
  bloom(s,c,k,t){const f=s._fl||MINI.danube.rate(s),u=E.out(k),ph=s.rm?0:t/700*(1-.7*k);back(c);
    const g=c.createLinearGradient(0,164,0,256);g.addColorStop(0,"rgba(255,214,120,"+(.3+.08*f)*u+")");g.addColorStop(1,"rgba(255,190,90,"+(.12+.05*f)*u+")");c.fillStyle=g;c.fillRect(0,164,192,92);
    Y.forEach((y,i)=>wave(c,0,y,192,1.5-k,5,ph+i,0,"rgba(255,236,170,"+.5*u+")",1));
    glow(c,112,24-16*u,70+22*f,"#FFD890",(.3+.1*f)*u);shaft(c,112,10,150,30,.5,"#FFD890",(.08+.03*f)*u);shaft(c,112,10,150,22,-.3,"#FFD890",(.06+.03*f)*u);
    const w=clamp((k-.3)/.7,0,1),x=lerp(118,84,w),y=lerp(162,134,w);
    if(k<.3)mar(c,"mar_stoop",118,162);else{mar(c,"mar_walk_"+(s.rm?0:t/180%2|0),x,y,{flip:true});c.fillStyle="#A8A8B0";c.beginPath();c.ellipse(x-4,y-9,3,2.2,0,0,7);c.fill()}
    gradeN(c,"warm",(.06+.05*f)*u)},
  auto(s,inp){for(const q of s.th)if(q.m<0&&!q.p&&Math.abs(q.x-NOW)<=3)inp[["uTap","rTap","dTap"][q.ln]]=true}
};
}
})();
/* GAME:danube:END */
MINI_LOADED.s2=true;
