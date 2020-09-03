// eslint-disable-next-line import/prefer-default-export
export const stopwords: Set<string> = new Set([
  'a',
  'able',
  'about',
  'above',
  'abst',
  'accordance',
  'according',
  'accordingly',
  'across',
  'act',
  'actually',
  'added',
  'adj',
  'affected',
  'affecting',
  'affects',
  'after',
  'afterwards',
  'again',
  'against',
  'ah',
  "ain't",
  'all',
  'allow',
  'allows',
  'almost',
  'alone',
  'along',
  'already',
  'also',
  'although',
  'always',
  'am',
  'among',
  'amongst',
  'an',
  'and',
  'announce',
  'another',
  'any',
  'anybody',
  'anyhow',
  'anymore',
  'anyone',
  'anything',
  'anyway',
  'anyways',
  'anywhere',
  'apart',
  'apparently',
  'appear',
  'appreciate',
  'appropriate',
  'approximately',
  'are',
  'aren',
  "aren't",
  'arent',
  'arise',
  'around',
  "a's",
  'as',
  'aside',
  'ask',
  'asking',
  'associated',
  'at',
  'auth',
  'available',
  'away',
  'awfully',
  'b',
  'back',
  'be',
  'became',
  'because',
  'become',
  'becomes',
  'becoming',
  'been',
  'before',
  'beforehand',
  'begin',
  'beginning',
  'beginnings',
  'begins',
  'behind',
  'being',
  'believe',
  'below',
  'beside',
  'besides',
  'best',
  'better',
  'between',
  'beyond',
  'biol',
  'both',
  'brief',
  'briefly',
  'but',
  'by',
  'c',
  'ca',
  'came',
  'can',
  'cannot',
  "can't",
  'cant',
  'cause',
  'causes',
  'certain',
  'certainly',
  'changes',
  'choice',
  'clearly',
  "c'mon",
  'co',
  'com',
  'come',
  'comes',
  'concerning',
  'cons',
  'consequently',
  'consider',
  'considering',
  'contain',
  'containing',
  'contains',
  'corresponding',
  'could',
  "couldn't",
  'couldnt',
  'course',
  "c's",
  'currently',
  'd',
  'date',
  'definitely',
  'described',
  'despite',
  'did',
  "didn't",
  'different',
  'do',
  'does',
  "doesn't",
  'doing',
  'done',
  "don't",
  'down',
  'downwards',
  'due',
  'during',
  'e',
  'each',
  'ed',
  'edu',
  'effect',
  'eg',
  'eight',
  'eighty',
  'either',
  'else',
  'elsewhere',
  'end',
  'ending',
  'enough',
  'entirely',
  'especially',
  'et',
  'et-al',
  'etc',
  'even',
  'ever',
  'every',
  'everybody',
  'everyone',
  'everything',
  'everywhere',
  'ex',
  'exactly',
  'example',
  'except',
  'f',
  'far',
  'few',
  'ff',
  'fifth',
  'first',
  'five',
  'fix',
  'followed',
  'following',
  'follows',
  'for',
  'former',
  'formerly',
  'forth',
  'found',
  'four',
  'from',
  'further',
  'furthermore',
  'g',
  'gave',
  'get',
  'gets',
  'getting',
  'give',
  'given',
  'gives',
  'giving',
  'go',
  'goes',
  'going',
  'gone',
  'got',
  'gotten',
  'greetings',
  'h',
  'had',
  "hadn't",
  'happens',
  'hardly',
  'has',
  "hasn't",
  'have',
  "haven't",
  'having',
  'he',
  "he'd",
  'hed',
  "he'll",
  'hello',
  'help',
  'hence',
  'her',
  'here',
  'hereafter',
  'hereby',
  'herein',
  "here's",
  'heres',
  'hereupon',
  'hers',
  'herself',
  "he's",
  'hes',
  'hi',
  'hid',
  'him',
  'himself',
  'his',
  'hither',
  'home',
  'hopefully',
  'how',
  'howbeit',
  'however',
  "how's",
  'hundred',
  'i',
  "i'd",
  'id',
  'ie',
  'if',
  'ignored',
  "i'll",
  "i'm",
  'im',
  'immediate',
  'immediately',
  'importance',
  'important',
  'in',
  'inasmuch',
  'inc',
  'indeed',
  'index',
  'indicate',
  'indicated',
  'indicates',
  'information',
  'inner',
  'insofar',
  'instead',
  'into',
  'invention',
  'inward',
  'is',
  "isn't",
  'it',
  "it'd",
  'itd',
  "it'll",
  "it's",
  'its',
  'itself',
  "i've",
  'j',
  'just',
  'k',
  'keep',
  'keep	keeps',
  'keeps',
  'kept',
  'kg',
  'km',
  'know',
  'known',
  'knows',
  'l',
  'largely',
  'last',
  'lately',
  'later',
  'latter',
  'latterly',
  'least',
  'less',
  'lest',
  'let',
  "let's",
  'lets',
  'like',
  'liked',
  'likely',
  'line',
  'little',
  "'ll",
  'look',
  'looking',
  'looks',
  'ltd',
  'm',
  'made',
  'mainly',
  'make',
  'makes',
  'many',
  'may',
  'maybe',
  'me',
  'mean',
  'means',
  'meantime',
  'meanwhile',
  'merely',
  'mg',
  'might',
  'million',
  'miss',
  'ml',
  'more',
  'moreover',
  'most',
  'mostly',
  'mr',
  'mrs',
  'much',
  'mug',
  'must',
  "mustn't",
  'my',
  'myself',
  'n',
  'na',
  'name',
  'namely',
  'nay',
  'nd',
  'near',
  'nearly',
  'necessarily',
  'necessary',
  'need',
  'needs',
  'neither',
  'never',
  'nevertheless',
  'new',
  'next',
  'nine',
  'ninety',
  'no',
  'nobody',
  'non',
  'none',
  'nonetheless',
  'noone',
  'nor',
  'normally',
  'nos',
  'not',
  'noted',
  'nothing',
  'novel',
  'now',
  'nowhere',
  'o',
  'obtain',
  'obtained',
  'obviously',
  'of',
  'off',
  'often',
  'oh',
  'ok',
  'okay',
  'old',
  'omitted',
  'on',
  'once',
  'one',
  'ones',
  'only',
  'onto',
  'or',
  'ord',
  'other',
  'others',
  'otherwise',
  'ought',
  'our',
  'ours',
  'ourselves',
  'ours	ourselves',
  'out',
  'outside',
  'over',
  'overall',
  'owing',
  'own',
  'p',
  'page',
  'pages',
  'part',
  'particular',
  'particularly',
  'past',
  'per',
  'perhaps',
  'placed',
  'please',
  'plus',
  'poorly',
  'possible',
  'possibly',
  'potentially',
  'pp',
  'predominantly',
  'present',
  'presumably',
  'previously',
  'primarily',
  'probably',
  'promptly',
  'pros',
  'proud',
  'provides',
  'put',
  'q',
  'que',
  'quickly',
  'quite',
  'qv',
  'r',
  'ran',
  'rather',
  'rd',
  're',
  'readily',
  'really',
  'reasonably',
  'recent',
  'recently',
  'ref',
  'refs',
  'regarding',
  'regardless',
  'regards',
  'related',
  'relatively',
  'research',
  'respectively',
  'resulted',
  'resulting',
  'results',
  'right',
  'run',
  's',
  'said',
  'same',
  'saw',
  'say',
  'saying',
  'says',
  'sec',
  'second',
  'secondly',
  'section',
  'see',
  'seeing',
  'seem',
  'seemed',
  'seeming',
  'seems',
  'seen',
  'self',
  'selves',
  'sensible',
  'sent',
  'serious',
  'seriously',
  'seven',
  'several',
  'shall',
  "shan't",
  'she',
  "she'd",
  'shed',
  "she'll",
  "she's",
  'shes',
  'should',
  "shouldn't",
  'show',
  'showed',
  'shown',
  'showns',
  'shows',
  'significant',
  'significantly',
  'similar',
  'similarly',
  'since',
  'six',
  'slightly',
  'so',
  'some',
  'somebody',
  'somehow',
  'someone',
  'somethan',
  'something',
  'sometime',
  'sometimes',
  'somewhat',
  'somewhere',
  'soon',
  'sorry',
  'specifically',
  'specified',
  'specify',
  'specifying',
  'still',
  'stop',
  'strongly',
  'sub',
  'substantially',
  'successfully',
  'such',
  'sufficiently',
  'suggest',
  'sup',
  'sure',
  'sure	t',
  'take',
  'taken',
  'taking',
  'tell',
  'tends',
  'th',
  'than',
  'thank',
  'thanks',
  'thanx',
  'that',
  "that'll",
  "that's",
  'thats',
  "that've",
  'the',
  'their',
  'theirs',
  'them',
  'themselves',
  'then',
  'thence',
  'there',
  'thereafter',
  'thereby',
  'thered',
  'therefore',
  'therein',
  "there'll",
  'thereof',
  'therere',
  "there's",
  'theres',
  'thereto',
  'thereupon',
  "there've",
  'these',
  'they',
  "they'd",
  'theyd',
  "they'll",
  "they're",
  'theyre',
  "they've",
  'think',
  'third',
  'this',
  'thorough',
  'thoroughly',
  'those',
  'thou',
  'though',
  'thoughh',
  'thousand',
  'three',
  'throug',
  'through',
  'throughout',
  'thru',
  'thus',
  'til',
  'tip',
  'to',
  'together',
  'too',
  'took',
  'toward',
  'towards',
  'tried',
  'tries',
  'truly',
  'try',
  'trying',
  "t's",
  'ts',
  'twice',
  'two',
  'u',
  'un',
  'under',
  'unfortunately',
  'unless',
  'unlike',
  'unlikely',
  'until',
  'unto',
  'up',
  'upon',
  'ups',
  'us',
  'use',
  'used',
  'useful',
  'usefully',
  'usefulness',
  'uses',
  'using',
  'usually',
  'v',
  'value',
  'various',
  "'ve",
  'very',
  'via',
  'viz',
  'vol',
  'vols',
  'vs',
  'w',
  'want',
  'wants',
  'was',
  "wasn't",
  'wasnt',
  'way',
  'we',
  "we'd",
  'wed',
  'welcome',
  "we'll",
  'well',
  'went',
  "we're",
  'were',
  "weren't",
  'werent',
  "we've",
  'what',
  'whatever',
  "what'll",
  "what's",
  'whats',
  'when',
  'whence',
  'whenever',
  "when's",
  'where',
  'whereafter',
  'whereas',
  'whereby',
  'wherein',
  "where's",
  'wheres',
  'whereupon',
  'wherever',
  'whether',
  'which',
  'while',
  'whim',
  'whither',
  'who',
  'whod',
  'whoever',
  'whole',
  "who'll",
  'whom',
  'whomever',
  "who's",
  'whos',
  'whose',
  'why',
  "why's",
  'widely',
  'will',
  'willing',
  'wish',
  'with',
  'within',
  'without',
  'wonder',
  "won't",
  'wont',
  'words',
  'world',
  'would',
  "wouldn't",
  'wouldnt',
  'www',
  'x',
  'y',
  'yes',
  'yet',
  'you',
  "you'd",
  'youd',
  "you'll",
  'your',
  "you're",
  'youre',
  'yours',
  'yourself',
  'yourselves',
  "you've",
  'z',
  'zero',
]);
