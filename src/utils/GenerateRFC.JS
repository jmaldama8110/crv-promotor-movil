const tblClaveHomonimo = {
  ' ': '00',
  '0': '00',
  '1': '01',
  '2': '02',
  '3': '03',
  '4': '04',
  '5': '05',
  '6': '06',
  '7': '07',
  '8': '08',
  '9': '09',
  '&': '10',
  A: '11',
  B: '12',
  C: '13',
  D: '14',
  E: '15',
  F: '16',
  G: '17',
  H: '18',
  I: '19',
  J: '21',
  K: '22',
  L: '23',
  M: '24',
  N: '25',
  O: '26',
  P: '27',
  Q: '28',
  R: '29',
  S: '32',
  T: '33',
  U: '34',
  V: '35',
  W: '36',
  X: '37',
  Y: '38',
  Z: '39',
  Ñ: '40',
};

const tblCoeficienteResiduo = {
  '0': '1',
  '1': '2',
  '2': '3',
  '3': '4',
  '4': '5',
  '5': '6',
  '6': '7',
  '7': '8',
  '8': '9',
  '9': 'A',
  '10': 'B',
  '11': 'C',
  '12': 'D',
  '13': 'E',
  '14': 'F',
  '15': 'G',
  '16': 'H',
  '17': 'I',
  '18': 'J',
  '19': 'K',
  '20': 'L',
  '21': 'M',
  '22': 'N',
  '23': 'O',
  '24': 'P',
  '25': 'R',
  '26': 'S',
  '27': 'T',
  '28': 'U',
  '29': 'V',
  '30': 'W',
  '31': 'X',
  '32': 'Y',
  '33': 'Z',
};

const tblCodigoVerificadorRFC = {
  '0': '00',
  '1': '01',
  '2': '02',
  '3': '03',
  '4': '04',
  '5': '05',
  '6': '06',
  '7': '07',
  '8': '08',
  '9': '09',
  A: '10',
  B: '11',
  C: '12',
  D: '13',
  E: '14',
  F: '15',
  G: '16',
  H: '17',
  I: '18',
  J: '19',
  K: '20',
  L: '21',
  M: '22',
  N: '23',
  '&': '24',
  O: '25',
  P: '26',
  Q: '27',
  R: '28',
  S: '29',
  T: '30',
  U: '31',
  V: '32',
  W: '33',
  X: '34',
  Y: '35',
  Z: '36',
  ' ': '37',
  Ñ: '38',
};

const badWords = [
  'BUEI',
  'BUEY',
  'CACA',
  'CACO',
  'CAGA',
  'CAGO',
  'CAKA',
  'COGE',
  'COJA',
  'COJE',
  'COJI',
  'COJO',
  'CULO',
  'FETO',
  'GUEY',
  'JOTO',
  'KOGE',
  'KOJO',
  'KAKA',
  'KULO',
  'MAME',
  'MAMO',
  'MEAR',
  'MEON',
  'MION',
  'MOCO',
  'MULA',
  'PEDA',
  'PEDO',
  'PENE',
  'PUTA',
  'PUTO',
  'KACA',
  'KACO',
  'KAGA',
  'KAGO',
  'QULO',
  'RATA',
  'RUIN',
];

const estados = {
  AGUASCALIENTES: 'AS',
  'BAJA CALIFORNIA': 'BC',
  'BAJA CALIFORNIA SUR': 'BS',
  CAMPECHE: 'CC',
  COAHUILA: 'CL',
  COLIMA: 'CM',
  CHIAPAS: 'CS',
  CHIHUAHUA: 'CH',
  'CIUDAD DE MEXICO': 'DF',
  DURANGO: 'DG',
  GUANAJUATO: 'GT',
  GUERRERO: 'GR',
  HIDALGO: 'HG',
  JALISCO: 'JC',
  MÉXICO: 'MC',
  MICHOACÁN: 'MN',
  MORELOS: 'MS',
  NAYARIT: 'NT',
  'NUEVO LEÓN': 'NL',
  OAXACA: 'OC',
  PUEBLA: 'PL',
  QUERÉTARO: 'QT',
  'QUINTANA ROO': 'QR',
  'SAN LUIS POTOSÍ': 'SP',
  SINALOA: 'SL',
  SONORA: 'SR',
  TABASCO: 'TC',
  TAMAULIPAS: 'TS',
  TLAXCALA: 'TL',
  VERACRUZ: 'VZ',
  YUCATÁN: 'YN',
  ZACATECAS: 'ZS',
};

const vocales = ['A', 'E', 'I', 'O', 'U'];

const nameFrecuently = ['JOSE', 'MARIA'];

const tblCodigoVerificadorCurp = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  A: '10',
  B: '11',
  C: '12',
  D: '13',
  E: '14',
  F: '15',
  G: '16',
  H: '17',
  I: '18',
  J: '19',
  K: '20',
  L: '21',
  M: '22',
  Ñ: '23',
  N: '24',
  O: '25',
  P: '26',
  Q: '27',
  R: '28',
  S: '29',
  T: '30',
  U: '31',
  V: '32',
  W: '33',
  X: '34',
  Y: '35',
  Z: '36',
}

const curps = [
  {
    name: 'KEVIN EDUARDO',
    lastname: 'MAZARIEGOS',
    secondname: 'GOMEZ',
    curp: 'MAGK991229HCSZMV02',
    state: 'CHIAPAS',
    gender: 'H',
    birtday: '1999/12/29',
  },
  {
    name: 'JOSE LUIS',
    lastname: 'SOLORZANO',
    secondname: 'LOPEZ',
    curp: 'SOLL001001HCSLPSA1',
    state: 'CHIAPAS',
    gender: 'H',
    birtday: '2000/10/01',
  },
  {
    name: 'OMAR',
    lastname: 'MELENDEZ', //IRIARTE
    secondname: 'DIAZ',
    curp: 'MEDO000506HCSLZMA5',
    state: 'CHIAPAS',
    gender: 'H',
    birtday: '2000/05/06',
  },
  {
    name: 'EMMA',
    lastname: 'GOMEZ',
    secondname: 'DIAZ',
    curp: 'GODE561231',
    state: 'CHIAPAS',
    gender: 'H',
    birtday: '1956/12/31',
  },
  {
    name: 'ERNESTO',
    lastname: 'EK',
    secondname: 'Rivera',
    curp: 'GODE561231',
    state: 'CHIAPAS',
    gender: 'H',
    birtday: '2007/11/20',
  },
  {
    name: 'JUAN',
    lastname: 'MARTINEZ',
    secondname: '',
    curp: 'GODE561231',
    state: 'CHIAPAS',
    gender: 'H',
    birtday: '2020/12/01',
  },
  {
    name: 'CARINA IVON',
    lastname: 'UH',
    secondname: 'ABAN',
    curp: 'UXAC950402MYNHBR09',
    state: 'YUCATÁN',
    gender: 'M',
    birtday: '1995/04/02',
  },
    {
    name: 'ANA PATRICIA',
    lastname: 'JIMENEZ',
    secondname: 'REVUELTA',
    curp: 'JIRA030224MVZMVNA4',
    state: 'VERACRUZ',
    gender: 'M',
    birtday: '2003/02/24',
  },
];

function getClaveDiferenciadora(name) {
  const clave = getClaveValuesString(name);
  const arrPares = generateArrayPares(clave);
  const factor = 34;
  const resultMulti = multiplicationArrayPares(arrPares);
  let resultCifras = parseInt(resultMulti.toString().slice(-3));
  const cocienteDiv = parseInt(resultCifras / factor);
  const residuoDiv = resultCifras - cocienteDiv * factor;
  const homonimia = getHomonimia(cocienteDiv, residuoDiv);
  // console.log({clave,resultMulti, resultCifras, cocienteDiv, residuoDiv, homonimia})
  return homonimia;
}

function getClaveValuesString(name) {
  let clave = '0';
  for (let idx = 0; idx < name.length; idx++) {
    const c = tblClaveHomonimo[name[idx]];
    clave = clave + c;
  }
  return clave;
}

function generateArrayPares(clave) {
  const arrPares = [];
  for (let i = 0; i < clave.length; i++) {
    const item = clave.slice(i, i + 2);
    if (item.length > 1) {
      arrPares.push(item);
    }
  }
  return arrPares;
}

function multiplicationArrayPares(arrPares) {
  let resultMulti = 0;
  arrPares.map((item) => {
    resultMulti += parseInt(item) * parseInt(item[1]);
  });
  return resultMulti;
}

function getHomonimia(cociente, residuo) {
  let homonimia = '';
  homonimia += tblCoeficienteResiduo[cociente];
  homonimia += tblCoeficienteResiduo[residuo];
  return homonimia;
}

function getDigitoVerificadorRFC(rfcFactor12) {
  const rfcFactor13 = '';
  let sumaTotal = 0;
  let contador = 13;
  const factor = 11;
  for (let idx = 0; idx < rfcFactor12.length; idx++) {
    sumaTotal += parseInt(tblCodigoVerificadorRFC[rfcFactor12[idx]]) * contador;
    contador -= 1;
  }
  const cociente = parseInt(sumaTotal / factor);
  const residuo = sumaTotal - cociente * factor;

  if (residuo > 0 && residuo != 10) {
    const digitoVerificador = factor - residuo;
    return digitoVerificador.toString();
  } else if (residuo == 10) {
    const digitoVerificador = 'A';
    return digitoVerificador;
  } else if (residuo == 0) {
    const digitoVerificador = '0';
    return digitoVerificador;
  } else {
    const digitoVerificador = '0';
    return digitoVerificador;
  }
}

function getDigitoVerificadorCurp(curpFactor17) {
  let sumaTotal = 0;
  let contador = 18;
  const factor = 10;
  for(let idx = 0 ; idx < curpFactor17.length; idx++) {
    // console.log(curp[idx] + '->' + tblCodigoVerificadorCurp[curp[idx]])
    sumaTotal += parseInt(tblCodigoVerificadorCurp[curpFactor17[idx]]) * contador;
    contador --;
  }
  const cociente = parseInt(sumaTotal / factor);
  const residuo = sumaTotal - cociente * factor;
  let digitoVerificador = Math.abs(residuo - 10);
  console.log({sumaTotal, cociente, residuo, digitoVerificador})
  if(digitoVerificador == 10) digitoVerificador = 0
  return digitoVerificador;
}

function removeAccents(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

function generateCharName(name, lastname, secondname) {
  let characters = '';
  const arrLastname = lastname.split('');
  const arrSecondname = secondname.split('');

  let foundVocalesLastname = [];
  arrLastname.map((letra) => {
    if (vocales.includes(letra)) {
      foundVocalesLastname.push(letra);
    }
  });
  let foundVocalesSecondname = [];
  arrSecondname.map((letra) => {
    if (vocales.includes(letra)) {
      foundVocalesSecondname.push(letra);
    }
  });

  // REGLA 6 (EL NOMBRE ESTA FORMADO POR MAS DE DOS PALABRAS Y SE FILTRAN QUE NO SEAS name COMUNES EJ. "JUAN" o "MARIA")
  const names = name.split(' ');
  const charName = names.map((item) => {
    let nameR;
    if (nameFrecuently.includes(item)) {
      nameR = names[1];
    } else {
      nameR = names[0];
    }
    return nameR;
  });

  // REGLA 4 (APELLIDO PATERNO SE COMPONE DE UNA O DOS LETRAS)
  if (lastname.length <= 2 && lastname != '') {
    characters += lastname[0] + secondname[0] + charName[0][0] + charName[0][1];
  } else if (lastname == '') {
    // REGLA 7 (SOLO TIENE APELLIDO MATERNO)
    characters +=
      secondname[0] +
      foundVocalesSecondname[0] +
      charName[0][0] +
      charName[0][1];
  } else if (secondname == '') {
    // REGLA 7 (SOLO TIENE APELLIDO PATERNO)
    characters +=
      lastname[0] + foundVocalesLastname[0] + charName[0][0] + charName[0][1];
  } else {
    characters +=
      lastname[0] + foundVocalesLastname[0] + secondname[0] + charName[0][0];
  }

  return characters;
}

function generateDateBirthday(dateB) {
  const year = dateB.slice(2, 4);
  const month = dateB.slice(5, 7);
  const day = dateB.slice(8, 10);
  const dateBConver = `${year}${month}${day}`;
  return dateBConver;
}

// REGLA 9 (LAS PALABRAS FORMAN UNA PALABRA INCONVENIENTE)
function isBadWord(word) {
  if (badWords.includes(word)) {
    console.log('SI está');
    let newWord = word.slice(0, -1);
    newWord = newWord.concat('X');
    return newWord;
  } else {
    return word;
  }
}

function getFirstConsonante(word) {
  let consonante = '';
  let isItFirstVocal = false;
  for (let i = 0; i < word.length; i++) {
    const char = word.charAt(i);
    if (vocales.includes(char)) {
    } else {
      if (vocales.includes(word[0])) {
        isItFirstVocal = true;
      }
      consonante += word.charAt(i);
    }
  }
  return { consonante, isItFirstVocal };
}

function genarateCURP(data) {
  const { gender, state, lastname, secondname, name, birtday } = data;
  const codState = estados[state];
  const anioBirthDay = parseInt(birtday.slice(0,4));
  var letraAnioBirthDay = '0';
  if(anioBirthDay > 1999 ) letraAnioBirthDay = 'A'
  let curp = '';
  const consonanteLastname = getFirstConsonante(lastname);
  const consonanteSecondname = getFirstConsonante(secondname);
  const consonanteName = getFirstConsonante(name);
  console.log(consonanteName);
  let consonanteNameFilter;
  if (consonanteName.isItFirstVocal) {
    consonanteNameFilter = consonanteName.consonante[0];
  } else {
    consonanteNameFilter = consonanteName.consonante[1];
  }
  curp +=
    gender +
    codState +
    consonanteLastname.consonante[1] +
    consonanteSecondname.consonante[1] +
    consonanteNameFilter + letraAnioBirthDay;

  return curp;
}

function generateRFCandCURP(data) {
  // LIMPIAR ACENTOS
  const lastname = removeAccents(data.lastname);
  const secondname = removeAccents(data.secondname);
  const name = removeAccents(data.name);
  let charsName = generateCharName(name, lastname, secondname);
  charsName = isBadWord(charsName);
  const BirthDate = generateDateBirthday(data.birtday);
  const fullName = `${name} ${lastname} ${secondname}`;
  const claveDirenciadora = getClaveDiferenciadora(fullName);
  const rfcFactor10 = charsName + BirthDate;
  const curpFactor7 = genarateCURP(data);
  const rfcFactor12 = rfcFactor10 + claveDirenciadora;
  const digitoVerificador = getDigitoVerificadorRFC(rfcFactor12);
  const rfc = rfcFactor12 + digitoVerificador;
  const curpFactor17 = rfcFactor10 + curpFactor7;
  const digitoVerificadorCurp = getDigitoVerificadorCurp(curpFactor17);
  const curp = curpFactor17 + digitoVerificadorCurp;
  const obj = {
    name: fullName,
    curp: data.curp,
    curpGenerada: curp,
    curpIguales: data.curp == curp ? true : false,
    rfc: rfc,
  };

  return obj;
}

const numberPerson = 1;

console.log(generateRFCandCURP(curps[numberPerson]));










