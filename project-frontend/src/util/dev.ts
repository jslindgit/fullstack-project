interface ZipCity {
    city: string;
    zip: string;
}

const randomEmail = (): string => {
    return Math.random() < 0.5 ? 'jslind@gmail.com' : 'joonas@lindstedt.fi';
};

const randomFirstName = (): string => {
    const names = [
        'Tuula',
        'Anne',
        'Päivi',
        'Anna',
        'Ritva',
        'Leena',
        'Pirjo',
        'Sari',
        'Minna',
        'Tiina',
        'Riitta',
        'Timo',
        'Matti',
        'Jari',
        'Mika',
        'Markku',
        'Pekka',
        'Hannu',
        'Heikki',
        'Seppo',
        'Janne',
        'Ari',
    ];

    return names[Math.floor(Math.random() * names.length)];
};

const randomLastName = (): string => {
    const names = [
        'Korohonen',
        'Mäkinen',
        'Mäkelä',
        'Hämäläinen',
        'Laine',
        'Heikkinen',
        'Koskinen',
        'Järvinen',
        'Lehtonen',
        'Lehtinen',
        'Virtanen',
        'Nieminen',
        'Saarinen',
        'Salminen',
        'Niemi',
        'Salonen',
        'Turunen',
        'Salo',
        'Rantanen',
        'Tuominen',
    ];

    return names[Math.floor(Math.random() * names.length)];
};

const randomOrganization = (): string => {
    if (Math.random() < 0.7) {
        return '';
    } else {
        const orgs = [
            'Pohjolan Innovatiiviset Ratkaisut Oy',
            'Suomi Energiahuolto Ltd',
            'AurinkoTekno Oy',
            'TalviLogistiikka Solutions Oy',
            'LuontoLuksus Matkailu Oy',
            'Kotikutoiset Herkut Ky',
            'TeknologiaTaituri Oy',
            'Vihreä Voima Ekosähkö Oy',
            'TerveysToivo Wellness Oy',
            'Kultainen Kädentaito Design',
            'Digitaalinen Dynamo Oy',
            'EkoEnergia Ekosysteemit Oy',
            'Lumoava Luonto Matkat Oy',
            'Suomi StartUp Studiot Oy',
            'Polaris Polkupyörät Oy',
            'Taika-Tekniikka Oy',
            'Sisu Suunnittelu ja Rakennus Oy',
            'Kultainen Koruverstas Oy',
            'Suomi Sydämessä Matkailu Ry',
            'AurinkoAika Wellness Center',
        ];

        return orgs[Math.floor(Math.random() * orgs.length)];
    }
};

const randomPhone = (): string => {
    const pres = ['+350 40 ', '+35840', '+358 50 ', '+35850', '040 ', '050 ', '040-', '050-', '040', '050'];
    return pres[Math.floor(Math.random() * pres.length)] + (1000000 + Math.floor(Math.random() * 8999999)).toString();
};

const randomStreetAddress = (): string => {
    const streets = [
        'Mäntytie',
        'Aurinkokatu',
        'Koivuranta',
        'Pajapolku',
        'Tammikuja',
        'Vesitornintie',
        'Kultaraitti',
        'Harjutie',
        'Kevätlinna',
        'Sinikuja',
        'Kultakuja',
        'Kuusimetsäntie',
        'Kalliokatu',
        'Viljamäki',
        'Sateenkaarisilta',
        'Huvilatie',
        'Kesäpuro',
        'Rantaniitty',
        'Kultahietikko',
        'Pilvenpiirtäjäntie',
        'Hankikuja',
        'Syyskuja',
        'Aarniometsäntie',
        'Hopeatie',
    ];

    return streets[Math.floor(Math.random() * streets.length)] + ' ' + (1 + Math.floor(Math.random() * 40)).toString();
};

const randomZipCodeAndCity = (): ZipCity => {
    const zipCities: ZipCity[] = [
        { city: 'Vantaa', zip: '01670' },
        { city: 'Vantaa', zip: '00410' },
        { city: 'Vantaa', zip: '01350' },
        { city: 'Helsinki', zip: '00380' },
        { city: 'Helsinki', zip: '00120' },
        { city: 'Helsinki', zip: '00150' },
        { city: 'Espoo', zip: '02200' },
        { city: 'Tampere', zip: '33330' },
        { city: 'Turku', zip: '20100' },
        { city: 'Rovaniemi', zip: '96500' },
        { city: 'Porvoo', zip: '06450' },
    ];

    return zipCities[Math.floor(Math.random() * zipCities.length)];
};

export default {
    randomEmail,
    randomFirstName,
    randomLastName,
    randomOrganization,
    randomPhone,
    randomStreetAddress,
    randomZipCodeAndCity,
};
