// ─── All Simulation Data ─────────────────────────────────────────────────────

const DATA = {

  projectInfo: {
    students: [
      { name: "Muhammad Ammar Ajmal", id: "F2022376076" },
      { name: "Muhammad Afnan",       id: "F2022376028" },
    ],
    advisor:    "Maam Fatima Tariq",
    coadvisor:  "Dr. Muhammad Zunnurain Hussain",
    university: "University of Management and Technology, Lahore",
    department: "Department of Artificial Intelligence",
  },

  systemKPIs: {
    totalDevices:      1247,
    activeThreats:     3,
    detectionRate:     "97.34%",
    avgLatency:        "24ms",
    qkdSessions:       89,
    trustScore:        "92.3%",
    uptime:            "99.97%",
    falsePositiveRate: "0.31%",
  },

  modelMetrics: [
    { model:"Hybrid Q-Classical",       accuracy:0.9734,balanced_acc:0.9711,mcc:0.9689,f1_macro:0.9726,f1_weighted:0.9732,roc_auc:0.9971,pr_auc:0.9949,train_time:18.92,infer_time:0.041,type:"hybrid"   },
    { model:"Quantum-VQC (QEM)",         accuracy:0.9612,balanced_acc:0.9587,mcc:0.9521,f1_macro:0.9599,f1_weighted:0.9610,roc_auc:0.9934,pr_auc:0.9891,train_time:12.43,infer_time:0.031,type:"quantum"  },
    { model:"XGBoost (Classical)",       accuracy:0.9523,balanced_acc:0.9499,mcc:0.9421,f1_macro:0.9512,f1_weighted:0.9521,roc_auc:0.9917,pr_auc:0.9858,train_time:8.76, infer_time:0.022,type:"classical"},
    { model:"Random Forest (Classical)", accuracy:0.9481,balanced_acc:0.9453,mcc:0.9378,f1_macro:0.9467,f1_weighted:0.9479,roc_auc:0.9896,pr_auc:0.9831,train_time:4.21, infer_time:0.018,type:"classical"},
    { model:"QFL (Federated)",           accuracy:0.9389,balanced_acc:0.9361,mcc:0.9284,f1_macro:0.9378,f1_weighted:0.9387,roc_auc:0.9862,pr_auc:0.9804,train_time:31.14,infer_time:0.019,type:"quantum"  },
    { model:"Linear SVM",                accuracy:0.9102,balanced_acc:0.9071,mcc:0.8952,f1_macro:0.9088,f1_weighted:0.9099,roc_auc:0.9743,pr_auc:0.9622,train_time:2.87, infer_time:0.012,type:"classical"},
    { model:"Logistic Regression",       accuracy:0.8834,balanced_acc:0.8801,mcc:0.8621,f1_macro:0.8819,f1_weighted:0.8831,roc_auc:0.9611,pr_auc:0.9432,train_time:1.23, infer_time:0.008,type:"classical"},
  ],

  kfoldResults: [
    { model:"Hybrid Q-Classical", mean_f1:0.9719,std_f1:0.0034,mean_acc:0.9728,std_acc:0.0029 },
    { model:"Quantum-VQC (QEM)",  mean_f1:0.9591,std_f1:0.0041,mean_acc:0.9601,std_acc:0.0038 },
    { model:"XGBoost",            mean_f1:0.9505,std_f1:0.0052,mean_acc:0.9516,std_acc:0.0049 },
    { model:"Random Forest",      mean_f1:0.9459,std_f1:0.0061,mean_acc:0.9472,std_acc:0.0057 },
    { model:"QFL Federated",      mean_f1:0.9371,std_f1:0.0073,mean_acc:0.9382,std_acc:0.0069 },
    { model:"Linear SVM",         mean_f1:0.9081,std_f1:0.0089,mean_acc:0.9095,std_acc:0.0084 },
    { model:"Logistic Regression",mean_f1:0.8812,std_f1:0.0104,mean_acc:0.8826,std_acc:0.0099 },
  ],

  robustnessData: [
    { noise_pct:0,  hybrid:0.9734,vqc:0.9612,xgb:0.9523,rf:0.9481 },
    { noise_pct:5,  hybrid:0.9698,vqc:0.9571,xgb:0.9461,rf:0.9402 },
    { noise_pct:10, hybrid:0.9651,vqc:0.9519,xgb:0.9387,rf:0.9311 },
    { noise_pct:15, hybrid:0.9589,vqc:0.9448,xgb:0.9295,rf:0.9198 },
    { noise_pct:20, hybrid:0.9508,vqc:0.9361,xgb:0.9178,rf:0.9062 },
    { noise_pct:25, hybrid:0.9402,vqc:0.9248,xgb:0.9031,rf:0.8897 },
    { noise_pct:30, hybrid:0.9271,vqc:0.9109,xgb:0.8854,rf:0.8701 },
  ],

  missingnessData: [
    { missing_pct:0,  hybrid:0.9734,vqc:0.9612,xgb:0.9523,rf:0.9481 },
    { missing_pct:10, hybrid:0.9701,vqc:0.9583,xgb:0.9489,rf:0.9441 },
    { missing_pct:20, hybrid:0.9659,vqc:0.9541,xgb:0.9432,rf:0.9371 },
    { missing_pct:30, hybrid:0.9603,vqc:0.9481,xgb:0.9351,rf:0.9278 },
    { missing_pct:40, hybrid:0.9521,vqc:0.9398,xgb:0.9234,rf:0.9141 },
    { missing_pct:50, hybrid:0.9408,vqc:0.9289,xgb:0.9081,rf:0.8971 },
  ],

  rocData: [
    { fpr:0.000,hybrid:1.000,vqc:1.000,xgb:1.000,rf:1.000 },
    { fpr:0.005,hybrid:0.998,vqc:0.997,xgb:0.996,rf:0.994 },
    { fpr:0.010,hybrid:0.997,vqc:0.995,xgb:0.993,rf:0.991 },
    { fpr:0.020,hybrid:0.995,vqc:0.992,xgb:0.989,rf:0.986 },
    { fpr:0.050,hybrid:0.991,vqc:0.987,xgb:0.982,rf:0.978 },
    { fpr:0.100,hybrid:0.985,vqc:0.979,xgb:0.972,rf:0.967 },
    { fpr:0.150,hybrid:0.977,vqc:0.969,xgb:0.959,rf:0.952 },
    { fpr:0.200,hybrid:0.968,vqc:0.958,xgb:0.944,rf:0.935 },
    { fpr:0.300,hybrid:0.947,vqc:0.933,xgb:0.914,rf:0.901 },
    { fpr:0.400,hybrid:0.921,vqc:0.904,xgb:0.881,rf:0.864 },
    { fpr:0.500,hybrid:0.891,vqc:0.871,xgb:0.843,rf:0.823 },
    { fpr:0.600,hybrid:0.855,vqc:0.832,xgb:0.799,rf:0.776 },
    { fpr:0.700,hybrid:0.812,vqc:0.786,xgb:0.749,rf:0.723 },
    { fpr:0.800,hybrid:0.761,vqc:0.732,xgb:0.691,rf:0.661 },
    { fpr:0.900,hybrid:0.698,vqc:0.666,xgb:0.622,rf:0.589 },
    { fpr:1.000,hybrid:0.000,vqc:0.000,xgb:0.000,rf:0.000 },
  ],

  classDistribution: [
    { label:"Normal Traffic", count:4821, pct:38.2, color:"#0ba5ec" },
    { label:"DDoS Attack",    count:2134, pct:16.9, color:"#ef4444" },
    { label:"Botnet Activity",count:1876, pct:14.9, color:"#f97316" },
    { label:"Port Scan",      count:1542, pct:12.2, color:"#eab308" },
    { label:"Fuzzing",        count:1203, pct:9.5,  color:"#a855f7" },
    { label:"MITM Attack",    count:987,  pct:7.8,  color:"#d946ef" },
    { label:"Replay Attack",  count:61,   pct:0.5,  color:"#22c55e" },
  ],

  featureImportance: [
    { feature:"packet_rate",    importance:0.1842,permutation:0.1714 },
    { feature:"byte_entropy",   importance:0.1621,permutation:0.1589 },
    { feature:"flow_duration",  importance:0.1438,permutation:0.1392 },
    { feature:"fwd_pkt_len_max",importance:0.1219,permutation:0.1187 },
    { feature:"bwd_iat_std",    importance:0.1084,permutation:0.1048 },
    { feature:"protocol_type",  importance:0.0897,permutation:0.0843 },
    { feature:"tcp_flags",      importance:0.0761,permutation:0.0711 },
    { feature:"payload_size",   importance:0.0634,permutation:0.0598 },
    { feature:"src_port",       importance:0.0312,permutation:0.0289 },
    { feature:"dst_port",       importance:0.0192,permutation:0.0174 },
  ],

  latencyData: [
    { category:"Auth Latency",     classical:142,hybrid:89, quantum:67  },
    { category:"Anomaly Detect",   classical:38, hybrid:24, quantum:19  },
    { category:"Key Exchange",     classical:215,hybrid:134,quantum:98  },
    { category:"Policy Update",    classical:87, hybrid:53, quantum:41  },
    { category:"Threat Response",  classical:310,hybrid:198,quantum:152 },
  ],

  scalabilityData: [
    { devices:100,  classical_cpu:12, hybrid_cpu:8  },
    { devices:250,  classical_cpu:28, hybrid_cpu:17 },
    { devices:500,  classical_cpu:54, hybrid_cpu:31 },
    { devices:750,  classical_cpu:79, hybrid_cpu:44 },
    { devices:1000, classical_cpu:98, hybrid_cpu:56 },
    { devices:1500, classical_cpu:143,hybrid_cpu:78 },
    { devices:2000, classical_cpu:187,hybrid_cpu:99 },
  ],

  qemData: [
    { qubits:2,  noisy:0.891,zne:0.934,readout:0.921,combined:0.958 },
    { qubits:4,  noisy:0.861,zne:0.914,readout:0.899,combined:0.941 },
    { qubits:6,  noisy:0.827,zne:0.889,readout:0.873,combined:0.921 },
    { qubits:8,  noisy:0.791,zne:0.861,readout:0.844,combined:0.899 },
    { qubits:10, noisy:0.751,zne:0.831,readout:0.812,combined:0.874 },
    { qubits:12, noisy:0.708,zne:0.798,readout:0.778,combined:0.847 },
  ],

  trustEvents: [
    { time:"00:00",trust_score:0.94,anomalies:0  },
    { time:"02:00",trust_score:0.92,anomalies:1  },
    { time:"04:00",trust_score:0.89,anomalies:3  },
    { time:"06:00",trust_score:0.78,anomalies:11 },
    { time:"08:00",trust_score:0.61,anomalies:28 },
    { time:"10:00",trust_score:0.44,anomalies:52 },
    { time:"12:00",trust_score:0.38,anomalies:71 },
    { time:"14:00",trust_score:0.52,anomalies:41 },
    { time:"16:00",trust_score:0.71,anomalies:18 },
    { time:"18:00",trust_score:0.83,anomalies:7  },
    { time:"20:00",trust_score:0.91,anomalies:2  },
    { time:"22:00",trust_score:0.93,anomalies:1  },
  ],

  perClassMetrics: [
    { cls:"Normal",   precision:0.981,recall:0.978,f1:0.980,support:964 },
    { cls:"DDoS",     precision:0.974,recall:0.969,f1:0.972,support:427 },
    { cls:"Botnet",   precision:0.969,recall:0.963,f1:0.966,support:375 },
    { cls:"Port Scan",precision:0.966,recall:0.961,f1:0.964,support:308 },
    { cls:"Fuzzing",  precision:0.962,recall:0.957,f1:0.960,support:241 },
    { cls:"MITM",     precision:0.958,recall:0.952,f1:0.955,support:197 },
    { cls:"Replay",   precision:0.833,recall:0.833,f1:0.833,support:12  },
  ],

  confusionMatrix: {
    labels:["Normal","DDoS","Botnet","Port Scan","Fuzzing","MITM","Replay"],
    matrix:[
      [942,8,6,4,2,2,0],
      [4,414,5,2,1,1,0],
      [3,4,361,3,2,2,0],
      [2,2,3,296,3,2,0],
      [1,1,2,2,231,4,0],
      [1,2,2,1,3,188,0],
      [0,0,0,1,0,1,10],
    ]
  },

  qkdData: [
    { distance_km:10,  key_rate_kbps:1200 },
    { distance_km:25,  key_rate_kbps:780  },
    { distance_km:50,  key_rate_kbps:420  },
    { distance_km:75,  key_rate_kbps:195  },
    { distance_km:100, key_rate_kbps:84   },
    { distance_km:150, key_rate_kbps:21   },
  ],
};
