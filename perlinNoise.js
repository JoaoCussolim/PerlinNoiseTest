// let nOutputSize = screenToWorldX(canvas.width);
// let noiseSeed1D = new Array[nOutputSize]
// let perlinNoise1D = new Array[nOutputSize]
// for(let i = 0; i < nOutputSize; i++){
//     noiseSeed1D[i] = rng.nextFloat()
// }

// let octaveCount = 0

// let drawPerlinNoise1D = (nCount, seed, nOctaves, fOutput) => {
//     for(let x = 0; x < nCount; x++){
//         let fNoise = 0;
//         let scaleAcc = 0
//         for(let o = 0; o < nOctaves; o++){
//             let nPitch = nCount >> o
//             let nSample1 = (x / nPitch) * nPitch
//             let nSample2 = (nSample1 + nPitch) % nCount
//             let fBlend = (x - nSample1) / nPitch
//             let fSample = (1 - fBlend) * seed[nSample1] + fBlend * seed[nSample2]
//             fNoise += fSample * scale
//             scaleAcc += scale

//             scale /= 2
//         }
//         fOutput[x] = fNoise / scaleAcc
//     }
// }