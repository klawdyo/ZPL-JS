// Manual da linguagem
// https://www.zebra.com/content/dam/zebra/manuals/printers/common/programming/zpl-zbi2-pm-en.pdf
// Emulador de impressão
// http://labelary.com/viewer.html


const zpl = require('./zpl')

zpl
.command('POSITION', 150,150) 
.command('INTERLEAVED_2_5_BARCODE', 
          'N', // orientação normal
          '60', // altura
          'Y', // imprimir label
          'N', // N = não imprimir o label acima do código
          'N', // não calcular o mod11 e exibir no código
         )

  // Adiciona a string ao código de barras acima
.command('STRING', '1234567890') 

// Adiciona um comentário ao código
.command('COMMENT', 'Este código é um comentário')

// Adiciona uma fonte 
//.command('SCALABLE_BITMAPPED_FONT', 'ARIAL0001', 'N', '30') 


console.log(zpl.toString())