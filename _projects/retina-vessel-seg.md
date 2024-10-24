---
layout: page
title: Retina Vessel Segmentation with U-Net
description: 
img: assets/img/vessel-seg-final.png
importance: 1
category: work
related_publications: false

---

<!-- # Retina Vessel Segmentation based on Frangi vesselness filter and UNet architecture. -->

During my internship at L'Hôpital des Quinze-Vingts, Summer 2023, I proposed the following pipeline in order to perform vessel segmentation in Retina images obtained with Laser Doppler Holography :

1) A preprocessing step which consists to enhance vessels structures with a Frangi filter.

2) A U-Net architecture to learn a segmentation model. 

You can find my internship report (in french) <a href="/assets/pdf/projet-M1.pdf"> here </a> and the github repository <a href="https://github.com/simonqueric/RetinaVesselSegmentation"> there </a>.

### Results

Here are some images and plots of my results.

<!-- <img title="result" alt="Alt text" src="/assets/img/11_0.jpg" width="700" height="200"> -->

<img title="result" alt="Alt text" src="/assets/img/vessel-seg-final.png" width="700" height="220">

<img title="result" alt="Alt text" src="/assets/img/logs.png">

  
### References 

- [1] Z. Jadoon et al., Retinal Blood Vessels Segmentation using ISODATA and High Boost Filter
- [2]  A. Longo et al., Assessment of hessian-based Frangi vesselness filter in optoacoustic imaging, disponible <a href="https://mediatum.ub.tum.de/doc/1600558/1600558.pdf"> ici </a>
- [3] U-Net: Convolutional Networks for Biomedical Image Segmentation
- [4] <a href="https://github.com/nikhilroxtomar/Retina-Blood-Vessel-Segmentation-in-PyTorch/tree/main"> Github about U-Net for Blood Vessel Segmentation </a>

