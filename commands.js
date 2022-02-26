
module.exports.commands = {

/**
^XA
Start Format
The ^XA command is used at the beginning of ZPL II code. It is the opening bracket and indicates the start
of a new label format. This command is substituted with a single ASCII control character STX (control-B,
hexadecimal 02).
Format: ^XA
Comments: Valid ZPL II format requires that label formats should start with the ^XA command and end
with the ^XZ command. 

*/
START: {
    start: '^XA',
    end: '',
    format:'^XA',
    parameters: [],
    lineBreak: true,
},

  /**
^XZ
End Format
Description: The ^XZ command is the ending (closing) bracket. It indicates the end of a label format. When
this command is received, a label prints. This command can also be issued as a single ASCII control
character ETX (Control-C, hexadecimal 03).
Format: ^XZ
Comments: Label formats must start with the ^XA command and end with the ^XZ command to be in valid
ZPL II format.

*/

END: {
    start: '^XZ',
    end: '',
    format:'^XZ',
    parameters: [],
    lineBreak: true,
},

/**
^FX
Comment
The ^FX command is useful when you want to add non-printing informational comments or statements
within a label format. Any data after the ^FX command up to the next caret (^) or tilde (~) command does
not have any effect on the label format. Therefore, you should avoid using the caret (^) or tilde (~)
commands within the ^FX statement.
Format: ^FXc

c = non printing comment Creates a non-printable comment. 

*/
COMMENT: {
    start: '^FX',
    end: '^FS', // finaliza o comando do comentário
    format:'^FX oausdoiauoidu ^FS',
    lineBreak: true,
    parameters: [
       {
          name: 'c',
          description: 'Non printing comment',
          regex: null,
          validation: null,
          required: true,
          default: null, // default null não preenche nada
        },  
    ]
},
  
/**
^FD
Field Data
The ^FD command defines the data string for a field. The field data can be any printable character except
those used as command prefixes (^ and ~).
In RFID printers, it can also be used to specify passwords to write to tags.
Format: ^FDa

a =
  data to be printed (all printers), or a password to be
  written to a RFID tag (rfid printers)
  Values: any data string up to 3072 bytes
  Default: none—a string of characters must be entered

*/

STRING: {
    start: '^FD',
    end: '^FS',
    format:'^FD oausdoiauoidu ^FS',
    lineBreak: true,
    parameters: [
       {
          name: 'a',
          description: 'Data to be printed',
          regex: null,
          validation: null,
          required: true,
          default: null, // default null não preenche nada
        },  
    ]
},

  /**


^FO
Field Origin
The ^FO command sets a field origin, relative to the label home (^LH) position. ^FO sets the upper-left
corner of the field area by defining points along the x-axis and y-axis independent of the rotation.
Format: ^FOx,y,z
Comments: If the value entered for the x or y parameter is too high, it could position the field origin
completely off the label.
This command interacts with the field direction parameter of ^FP and with the rotation parameter of ^A. For
output and examples, see Field Interactions on page 1436.
The auto justification option might cause unexpected results if variable fields or bidirectional text are used
with ^FO. For the best results with bidirectional text and/or variable fields, use either the left of right
justification option.

x = x-axis location (in dots)
Values: 0 to 32000
Default: 0

y = y-axis location (in dots)
Values: 0 to 32000
Default: 0

z = justification (The z parameter is only supported in firmware versions)
V60.14.x,
V50.14.x, or later.
Values:
0 = left justification
1 = right justification
2 = auto justification (script dependent)
Default: last accepted ^FW value or ^FW default


*/

POSITION: {
    start: '^FO',
    end: '',
    format:'^FO oausdoiauoidu',
    lineBreak: false,
    parameters: [
      {
        name: 'x',
        description: 'x-axis location (in dots)',
        regex: /^[0-9]+$/i,
        validation: (n) => n>=1 && n <= 32000,
        required: false,
        default: 0, // set default if not filled and is required
      }, 
      {
        name: 'y',
        description: 'y-axis location (in dots)',
        regex: /^[0-9]+$/i,
        validation: (n) => n>=1 && n <= 32000,
        required: false,
        default: 0, // set default if not filled and is required
      }, 
      {
        name: 'z',
        description: 'justification',
        regex: /^[0-2]+$/i,
        validation: null,
        required: false,
        default: null, // set default if not filled and is required
      }, 
    ]
},
  
  
/**

^A
Scalable/Bitmapped Font
The ^A command specifies the font to use in a text field. ^A designates the font for the current ^FD
statement or field. The font specified by ^A is used only once for that ^FD entry. If a value for ^A is not
specified again, the default ^CF font is used for the next ^FD entry.
Format: ^Afo,h,w

f = font name Values: A through Z, and 0 to 9
  Any font in the printer (downloaded, EPROM, stored fonts, fonts A through Z
  and 0 to 9).
  IMPORTANT: Parameter f is required. If f is omitted it defaults to
  the last value of the ^CF command.

o = field orientation 
  Values:
  N = normal
  R = rotated 90 degrees (clockwise)
  I = inverted 180 degrees
  B = read from bottom up, 270 degrees
  Default: the last accepted ^FW value or the ^FW default

h = Character Height (in dots) Scalable
  Values: 10 to 32000
  Default: last accepted ^CF
  Bitmapped
  Values: multiples of height from 1 to 10 times the standard height, in
  increments of 1
  Default: last accepted ^CF

w = width (in dots) Scalable
  Values: 10 to 32000
  Default: last accepted ^CF
  Bitmapped
  Values: multiples of width from 1 to 10 times the standard width, in
  increments of 1
  Default: last accepted ^CF

*/
  
    SCALABLE_BITMAPPED_FONT: {
      start: '^A',
      end: '',
      format: '^Afo,h,w',
      description: 'Scalable/Bitmapped Font',
      lineBreak: false,
      parameters: [
        {
          name: 'f',
          description: 'Font name',
          regex: /^[a-z0-9]+$/i,
          validation: null,
          required: true,
          default: null, // default null não preenche nada
        },        
        {
          name: 'o',
          description: 'Field orientation',
          regex: /^[NRIB]{1}$/i,
          validation: null,
          required: false,
          default: null, // default null não preenche nada
        },        
        {
          name: 'h',
          description: 'Character Height (in dots) Scalable',
          regex: /^[0-9]+$/i,
          validation: (n) => !n || n>=10 && n<=32000,
          required: false,
          default: null, // default null não preenche nada
        },
        {
          name: 'w',
          description: 'width (in dots) Scalable',
          regex: /^[0-9]+$/i,
          validation: (n) => !n || n>=10 && n<=32000, // não é obrigatório, entãodeixa passar se estiver vazio
          required: false,
          default: null, // default null não preenche nada
        },      
      ]
    },


/**

^A@
Use Font Name to Call Font
The ^A@ command uses the complete name of a font, rather than the character designation used in ^A.
Once a value for ^A@ is defined, it represents that font until a new font name is specified by ^A@.
Format: ^A@o,h,w,d:f.x


o = field orientation Values:
  N = normal
  R = rotates 90 degrees (clockwise)
  I = inverted 180 degrees
  B = read from bottom up, 270 degrees
  Default: N or the last ^FW value

h = character height (in dots)
  Default:
  Specifies magnification by w (character width) or the last accepted ^CF
  value. Uses the base height if none is specified.
  • Scalable
  The value is the height in dots of the entire character block.
  Magnification factors are unnecessary, because characters are scaled.
  • Bitmapped
  The value is rounded to the nearest integer multiple of the font’s base
  height, then divided by the font’s base height to give a magnification
  nearest limit.

w = width (in dots) Default: Specifies magnification by h (height) or the last accepted ^CF
  value. Specifies the base width is used if none is specified.
  • Scalable
  The value is the width in dots of the entire character block. Magnification
  factors are unnecessary, because characters are scaled.
  • Bitmapped
  The value rounds to the nearest integer multiple of the font’s base width,
  then divided by the font’s base width to give a magnification nearest
  limit.

d = drive location of font Values: R:, E:, B:, and A:
  Default: R:

f = font name Values: any valid font
  Default: if an invalid or no name is entered, the default set by ^CF is used If
  no font has been specified in ^CF, font A is used.
  The font named carries over on all subsequent ^A@ commands without a
  font name

x = extension
  .TTE is only
  supported in
  firmware version
  V60.14.x,
  V50.14.x, or later.
  Values:
  .FNT = font
  .TTF = TrueType Font
  .TTE = TrueType Extension

*/
FONT_NAME: {
  start: '^A@',
  end: '',
  format: '^A@o,h,w,d:f.x',
  description: '',
  lineBreak: false,
  parameters: [
    // {
    //   name: 'a',
    //   description: 'description'
    //   regex: /^[a-z0-9]$/i,
    //   validation: null,
    //   required: false,
    //   default: null, // set default if not filled and is required
    // }, 
  ],
},


  



/**

^B0
Aztec Bar Code Parameters
The ^B0 command creates a two-dimensional matrix symbology made up of square modules arranged
around a bulls-eye pattern at the center.
NOTE: The Aztec bar code works with firmware version V60.13.0.11A and V50.13.2 or later.
Format: ^B0a,b,c,d,e,f,g

Parameters
a = orientation Values:
  N = normal
  R = rotated
  I = inverted 180 degrees
  B = read from bottom up, 270 degrees
  Default: current ^FW value

b = magnification factor Values: 1 to 10
  Default:
  1 on 150 dpi printers
  2 on 200 dpi printers
  3 on 300 dpi printers
  6 on 600 dpi printers

c = extended channel interpretation code indicator
  Values:
  Y = if data contains ECICs
  N = if data does not contain ECICs
  Default: N
  d = error control and
  symbol size/type indicator
  Values:
  0 = default error correction level
  01 to 99 = error correction percentage (minimum)
  101 to 104 = 1 to 4-layer compact symbol
  201 to 232 = 1 to 32-layer full-range symbol
  300 = a simple Aztec “Rune”
  Default: 0

e = menu symbol indicator
  Values:
  Y = if this symbol is to be a menu (bar code reader initialization) symbol
  N = if it is not a menu symbol
  Default: N
  f = number of symbols
  for structured append
  Values: 1 through 26
  Default: 1

g = optional ID field for structured append
  The ID field is a text string with 24-character maximum
  Default: no ID
*/
AZTEC_BARCODE: {
  start: '^B0R',
  end: '',
  format: '^B0a,b,c,d,e,f,g',
  description: '',
  lineBreak: false,
  parameters: [
    // {
    //   name: 'a',
    //   description: 'description'
    //   regex: /^[a-z0-9]$/i,
    //   validation: null,
    //   required: false,
    //   default: null, // set default if not filled and is required
    // }, 
  ],
},




  



/**

^B1
Code 11 Bar Code
The ^B1 command produces the Code 11 bar code, also known as USD-8 code. In a Code 11 bar code,
each character is composed of three bars and two spaces, and the character set includes 10 digits and the
hyphen (-).
• ^B1 supports print ratios of 2.0:1 to 3.0:1.
• Field data (^FD) is limited to the width (or length, if rotated) of the label.
IMPORTANT: If additional information about this bar code is required, go to www.aimglobal.org.
Format: ^B1o,e,h,f,g

o = orientation 
  Values:
  N = normal
  R = rotated 90 degrees (clockwise)
  I = inverted 180 degrees
  B = read from bottom up, 270 degrees
  Default: current ^FW value

e = check digit 
  Values:
  Y = 1 digit
  N = 2 digits
  Default: N

h = bar code height (in dots)
  Values: 1 to 32000
  Default: Value set by ^BY

f = print interpretation line
  Values:
  Y = yes
  N = no
  Default: Y

g = print interpretation line above code
  Values:
  Y = yes
  N = no
  Default: N

*/
CODE_11_BARCODE: {
  start: '^B1',
  end: '',
  format: '^B1o,e,h,f,g',
  description: '',
  lineBreak: false,
  parameters: [
    // {
    //   name: 'a',
    //   description: 'description'
    //   regex: /^[a-z0-9]$/i,
    //   validation: null,
    //   required: false,
    //   default: null, // set default if not filled and is required
    // }, 
  ],
},

  



/**

^B2
Interleaved 2 of 5 Bar Code
The ^B2 command produces the Interleaved 2 of 5 bar code, a high-density, self-checking, continuous,
numeric symbology.
Each data character for the Interleaved 2 of 5 bar code is composed of five elements: five bars or five
spaces. Of the five elements, two are wide and three are narrow. The bar code is formed by interleaving
characters formed with all spaces into characters formed with all bars.
• ^B2 supports print ratios of 2.0:1 to 3.0:1.
• Field data (^FD) is limited to the width (or length, if rotated) of the label.
IMPORTANT: If additional information about this bar code is required, go to www.aimglobal.org.
Format: ^B2o,h,f,g,e,j

o = orientation 
  Values:
  N = normal
  R = rotated 90 degrees (clockwise)
  I = inverted 180 degrees
  B = read from bottom up, 270 degrees
  Default: current ^FW value

h = bar code height (in dots)
  Values: 1 to 32000
  Default: value set by ^BY
  f = print interpretation line
  Values:
  Y = yes
  N = no
  Default: Y

g = print interpretation line above code
  Values:
  Y = yes
  N = no
  Default: N

e = calculate and print Mod 10 check digit
  Values:
  Y = yes
  N = no
  Default: N

*/
INTERLEAVED_2_5_BARCODE: {
  description: 'Interleaved 2 of 5 Bar Code ',
  start: '^B2',
  end: '',
  format: '^B2o,h,f,g,e,j',
  lineBreak: false,
  parameters: [
    {
      name: 'o',
      description: 'orientation',
      regex: /^[BRIN]$/i,
      validation: null,
      required: false,
      default: null, // set default if not filled and is required
    }, 
    {
      name: 'h',
      description: 'bar code height (in dots)',
      regex: /^[0-9]+$/i,
      validation: (n) => n >= 1 && n <= 32000,
      required: false,
      default: null, // set default if not filled and is required
    }, 
    {
      name: 'f',
      description: 'print interpretation line',
      regex: /^[YN]$/i,
      validation: null,
      required: false,
      default: 'Y', // set default if not filled and is required
    }, 
    {
      name: 'g',
      description: 'print interpretation line above code',
      regex: /^[YN]$/i,
      validation: null,
      required: false,
      default: 'N', // set default if not filled and is required
    },  
    {
      name: 'e',
      description: 'calculate and print Mod 10 check digit',
      regex: /^[YN]$/i,
      validation: null,
      required: false,
      default: 'N', // set default if not filled and is required
    }, 
  ],
},

  



  /**
  
  
  
  */
  CMD: {
    start: '',
    end: '',
    format: '',
    description: '',
    parameters: [
      // {
      //   name: 'a',
      //   description: 'description'
      //   regex: /^[a-z0-9]$/i,
      //   validation: null,
      //   required: false,
      //   default: null, // set default if not filled and is required
      // }, 
    ],
  },


  



  /**
  
  
  
  */
  CMD: {
    start: '',
    end: '',
    format: '',
    description: '',
    parameters: [
      // {
      //   name: 'a',
      //   description: 'description'
      //   regex: /^[a-z0-9]$/i,
      //   validation: null,
      //   required: false,
      //   default: null, // set default if not filled and is required
      // }, 
    ],
  },


  



  /**
  
  
  
  */
  CMD: {
    start: '',
    end: '',
    format: '',
    description: '',
    parameters: [
      // {
      //   name: 'a',
      //   description: 'description'
      //   regex: /^[a-z0-9]$/i,
      //   validation: null,
      //   required: false,
      //   default: null, // set default if not filled and is required
      // }, 
    ],
  },


  



  /**
  
  
  
  */
  CMD: {
    start: '',
    end: '',
    format: '',
    description: '',
    parameters: [
      // {
      //   name: 'a',
      //   description: 'description'
      //   regex: /^[a-z0-9]$/i,
      //   validation: null,
      //   required: false,
      //   default: null, // set default if not filled and is required
      // }, 
    ],
  },


  



  /**
  
  
  
  */
  CMD: {
    start: '',
    end: '',
    format: '',
    description: '',
    parameters: [
      // {
      //   name: 'a',
      //   description: 'description'
      //   regex: /^[a-z0-9]$/i,
      //   validation: null,
      //   required: false,
      //   default: null, // set default if not filled and is required
      // }, 
    ],
  },


  
}


















