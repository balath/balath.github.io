
function loadHome(){
	document.getElementById('home-msg').style.display = "block";
	document.getElementById('cont').innerHTML = '';
}

function loadPrologFile(){
	document.getElementById('home-msg').style.display = "none";
	document.getElementById('cont').innerHTML = '<embed src="files/bach-machine.html" type="text/html" width="90%" height="1000px"/>'; 	
}

function loadPecPDF(){
	alert('El archivo de la memoria está en construcción');
}	

//Management of Prolog harmony generation

const formatNote = note => note.replaceAll('_s','♯').replaceAll('_b','♭');	

const makeChordsTable = content => `<table id="chords-table"><tr><th>Cifrado</th><th>Acordes</th></tr>${content}</table>`;

const parseAnswer = answer => { 
	const chords = answer.links.Chords.toJavaScript().flatMap(_ => _).map(_ => formatNote(_.join(' - ')));
	const code = answer.links.Code.toJavaScript().flatMap(_ => _).map(_ => _.join(""));
	const tableRows = code
		.map((code,index) => `<td>${code}</td><td>${chords[index]}</td>`)
		.reduce((acc,row) => `${acc} <tr>${row}</tr>`);
	
	document.getElementById('cont').innerHTML = `${makeChordsTable(tableRows)}`;
};

function generate(){	
	const tono = document.getElementById('tonos').value;
	//Creating a session with Tau-Prolog
	let session = pl.create();
	session.consult(prologProgram);
	session.query(`coral(${tono},(Chords,Code)).`);
	session.answer(parseAnswer);
};

const prologProgram = `

:- use_module(library(random)).

% 1. Notas musicales:

do_b.
do.
do_s.
re_b.
re.
re_s.
mi_b.
mi.
mi_s.
fa_b.
fa.
fa_s.
fa_s_s.
sol_b.
sol.
sol_s.
la_b.
la.
la_s.
si_b.
si.
si_s.

% 2. Intervalos ascendentes: (min-menor, maj-mayor, aug-aumentada, dis-disminuida)

seg_min(do,re_b).
seg_min(do_s,re).
seg_min(re,mi_b).
seg_min(re_s,mi).
seg_min(mi_b,fa_b).
seg_min(mi,fa).
seg_min(mi_s,fa_s).
seg_min(fa,sol_b).
seg_min(fa_s,sol).
seg_min(sol,la_b).
seg_min(sol_s,la).
seg_min(la,si_b).
seg_min(la_s,si).
seg_min(si_b,do_b).
seg_min(si,do).
seg_min(si_s,do_s).

seg_maj(do_b,re_b).
seg_maj(do,re).
seg_maj(do_s,re_s).
seg_maj(re_b,mi_b).
seg_maj(re,mi).
seg_maj(re_s,mi_s).
seg_maj(mi_b,fa).
seg_maj(mi,fa_s).
seg_maj(fa_b,sol_b).
seg_maj(fa,sol).
seg_maj(fa_s,sol_s).
seg_maj(sol_b,la_b).
seg_maj(sol,la).
seg_maj(sol_s,la_s).
seg_maj(la_b,si_b).
seg_maj(la,si).
seg_maj(la_s,si_s).
seg_maj(si_b,do).
seg_maj(si,do_s).

ter_min(do,mi_b).
ter_min(do_s,mi).
ter_min(re_b,fa_b).
ter_min(re,fa).
ter_min(re_s,fa_s).
ter_min(mi_b,sol_b).
ter_min(mi,sol).
ter_min(mi_s,sol_s).
ter_min(fa,la_b).
ter_min(fa_s,la).
ter_min(fa_s_s,la_s).
ter_min(sol,si_b).
ter_min(sol_s,si).
ter_min(la_b,do_b).
ter_min(la,do).
ter_min(la_s,do_s).
ter_min(si_b,re_b).
ter_min(si,re).
ter_min(si_s,re_s).


ter_maj(do_b,mi_b).
ter_maj(do,mi).
ter_maj(do_s,mi_s).
ter_maj(re_b,fa).
ter_maj(re,fa_s).
ter_maj(re_s,fa_s_s).
ter_maj(mi_b,sol).
ter_maj(mi,sol_s).
ter_maj(fa_b,la_b).
ter_maj(fa,la).
ter_maj(fa_s,la_s).
ter_maj(sol_b,si_b).
ter_maj(sol,si).
ter_maj(sol_s,si_s).
ter_maj(la_b,do).
ter_maj(la,do_s).
ter_maj(si_b,re).
ter_maj(si,re_s).

cua_jus(do_b,fa_b).
cua_jus(do,fa).
cua_jus(do_s,fa_s).
cua_jus(re_b,sol_b).
cua_jus(re,sol).
cua_jus(re_s,sol_s).
cua_jus(mi_b,la_b).
cua_jus(mi,la).
cua_jus(mi_s,la_s).
cua_jus(fa,si_b).
cua_jus(fa_s,si).
cua_jus(sol_b,do_b).
cua_jus(sol,do).
cua_jus(sol_s,do_s).
cua_jus(la_b,re_b).
cua_jus(la,re).
cua_jus(la_s,re_s).
cua_jus(si_b,mi_b).
cua_jus(si,mi).
cua_jus(si_s,mi_s).

qui_jus(do_b,sol_b).
qui_jus(do,sol).
qui_jus(do_s,sol_s).
qui_jus(re_b,la_b).
qui_jus(re,la).
qui_jus(re_s,la_s).
qui_jus(mi_b,si_b).
qui_jus(mi,si).
qui_jus(mi_s,si_s).
qui_jus(fa_b,do_b).
qui_jus(fa,do).
qui_jus(fa_s,do_s).
qui_jus(sol_b,re_b).
qui_jus(sol,re).
qui_jus(sol_s,re_s).
qui_jus(la_b,mi_b).
qui_jus(la,mi).
qui_jus(la_s,mi_s).
qui_jus(si_b,fa).
qui_jus(si,fa_s).

% 3. Modos mayor/menor

esc_maj(I,[I,II,III,IV,V,VI,VII]) :- seg_maj(I,II),seg_maj(II,III),seg_min(III,IV),seg_maj(IV,V),seg_maj(V,VI),seg_maj(VI,VII),seg_min(VII,I).
esc_min(I,[I,II,III,IV,V,VI,VII]) :- seg_maj(I,II),seg_min(II,III),seg_maj(III,IV),seg_maj(IV,V),seg_min(V,VI),seg_maj(VI,VII),seg_maj(VII,I).

% 4. Acordes (formato xxxx_xxx)

% 4.1 Triadas

perf_maj([I,III,V]) :- ter_maj(I,III),ter_min(III,V).
perf_min([I,III,V]) :- ter_min(I,III),ter_maj(III,V).
quin_dis([I,III,V]) :- ter_min(I,III),ter_min(III,V).
quin_aug([I,III,V]) :- ter_maj(I,III),ter_maj(III,V).

triada(X) :- perf_maj(X);perf_min(X);quin_dis(X);quin_aug(X).

% 4.2 Cuatriadas

sept_min([I,III,V,VII]) :- ter_maj(I,III),ter_min(III,V),ter_min(V,VII).
sept_maj([I,III,V,VII]) :- ter_maj(I,III),ter_min(III,V),ter_maj(V,VII).
sept_dis([I,III,V,VII]) :- ter_min(I,III),ter_min(III,V),ter_min(V,VII).
sept_sem([I,III,V,VII]) :- ter_min(I,III),ter_min(III,V),ter_maj(V,VII).

cuatriada(X) :- sept_min(X);sept_maj(X);sept_dis(X);sept_sem(X).

% 4.3 Inversiones

inv_6([I,III,V],[III,V,I]) 	:- triada([I,III,V]).
inv_64([I,III,V],[V,I,III]) :- triada([I,III,V]).

inv_65([I,III,V,VII],[III,V,VII,I]) :- cuatriada([I,III,V,VII]).
inv_43([I,III,V,VII],[V,VII,I,III]) :- cuatriada([I,III,V,VII]).
inv_2([I,III,V,VII],[VII,I,III,V])	:- cuatriada([I,III,V,VII]).

% 5. Funciones tonales

% 5.1 Básicas

ton_maj(I,[I,III,V]) 			:- perf_maj([I,III,V]).
ton_min(I,[I,III,V]) 			:- perf_min([I,III,V]).
rel_maj(I,[III,V,VII]) 			:- perf_maj([III,V,VII]),esc_min(I,[I,_,III|_]),!.
ton_III(I,[III,V,VII]) 			:- perf_min([III,V,VII]),esc_maj(I,[I,_,III|_]),!.
dom(I,[V,VII,II]) 				:- perf_maj([V,VII,II]),qui_jus(I,V),!.
sept_dom(I,[V,VII,II,IV]) 		:- sept_min([V,VII,II,IV]),qui_jus(I,V),!.
sub_IV_maj(I,[IV,VI,I]) 		:- perf_maj([IV,VI,I]),!.
sub_II_maj(I,[II,IV,VI]) 		:- perf_min([II,IV,VI]),esc_maj(I,[I,II|_]),!.
sub_VI_maj(I,[VI,I,III]) 		:- perf_min([VI,I,III]),!.
dom_VII_maj(I,[VII,II,IV]) 		:- quin_dis([VII,II,IV]),esc_maj(I,[I,II|_]),!.
sept_dis_VII(I,[VII,II,IV,VI])	:- sept_dis([VII,II,IV,VI]),esc_maj(I,[I,II|_]),!.
sept_sen_VII(I,[VII,II,IV,VI])	:- sept_sem([VII,II,IV,VI]),esc_maj(I,[I,II|_]),!.

% 5.2 Dominantes y subdominantes secundarias

dom_dom(I,X) 		:- qui_jus(I,V),dom(V,X),!.
dom_dom_sept(I,X)	:- qui_jus(I,V),sept_dom(V,X),!.
sub_IV_dom(I,X)		:- qui_jus(I,V),sub_IV_maj(V,X),!.

dom_sub_sept(I,X)	:- cua_jus(I,IV),sept_dom(IV,X),!.

% 6. Semifrases cadenciales 

% 6.1 Procesos cadenciales que reafirman la tonalidad

cad_perf(I,([T,S64,D65,T],["T","S64","D65","T"])) 				:- ton_maj(I,T),sub_IV_maj(I,S),inv_64(S,S64),sept_dom(I,D7),inv_65(D7,D65),!.
cad_647(I,([T,S64,D64,D7,T],["T","S64","D64","D7","T"])) 		:- ton_maj(I,T),sub_IV_maj(I,S),inv_64(S,S64),inv_64(T,D64),sept_dom(I,D7),!.
cad_SIIDT(I,([T,SII,D65,T],["T","SII","D65","T"])) 				:- ton_maj(I,T),sub_II_maj(I,SII),sept_dom(I,D7),inv_65(D7,D65),!.
cad_SIISDT(I,([T,SII,S64,D65,T],["T","SII","S64","D65","T"])) 	:- ton_maj(I,T),sub_II_maj(I,SII),sub_IV_maj(I,S),inv_64(S,S64),sept_dom(I,D7),inv_65(D7,D65),!.
cad_SVISDT(I,([T,SVI6,S64,D65,T],["T","SVI6","S64","D65","T"]))	:- ton_maj(I,T),sub_VI_maj(I,SVI),inv_6(SVI,SVI6),sub_IV_maj(I,S),inv_64(S,S64),sept_dom(I,D7),inv_65(D7,D65),!.

	% 6.1.1 Elección aleatoria de frases conclusivas
	
	semifrase_conclusiva(I,(Acordes,Cifrado))	:- random_between(1,5,X),semifrase_conclusiva(I,(Acordes,Cifrado),X),!.
	
	semifrase_conclusiva(I,(Acordes,Cifrado),1)	:- cad_perf(I,(Acordes,Cifrado)),!.
	semifrase_conclusiva(I,(Acordes,Cifrado),2)	:- cad_647(I,(Acordes,Cifrado)),!.
	semifrase_conclusiva(I,(Acordes,Cifrado),3)	:- cad_SIIDT(I,(Acordes,Cifrado)),!.
	semifrase_conclusiva(I,(Acordes,Cifrado),4)	:- cad_SIISDT(I,(Acordes,Cifrado)),!.
	semifrase_conclusiva(I,(Acordes,Cifrado),5)	:- cad_SVISDT(I,(Acordes,Cifrado)),!.

% 6.3 Semi-conclusivas y no conclusivas que comienzan en subdominante

cad_plag_III(I,([S64,III,S,T],["S64","TIII","S","T"]))		:- ton_maj(I,T),ton_III(I,III),sub_IV_maj(I,S),inv_64(S,S64),!.
cad_plag_VI(I,([SII,SVI6,S64,T],["SII","SVI6","S64","T"]))	:- sub_II_maj(I,SII),ton_maj(I,T),sub_VI_maj(I,SVI),inv_6(SVI,SVI6),sub_IV_maj(I,S),inv_64(S,S64),!.
cad_semicad(I,([D6,III64,S6,D6],["D6","TIII64","S6","D6"]))	:- ton_III(I,III),inv_64(III,III64),sub_IV_maj(I,S),inv_6(S,S6),dom(I,D),inv_6(D,D6),!.
cad_rota(I,([SII,S64,D65,SVI6],["SII","S64","D65","SVI6"]))	:- sub_II_maj(I,SII),sub_IV_maj(I,S),inv_64(S,S64),sept_dom(I,D7),inv_65(D7,D65),sub_VI_maj(I,SVI),inv_6(SVI,SVI6),!.

	% 6.1.1 Elección aleatoria de frases no conclusivas

	semifrase_no_conclusiva(I,(Acordes,Cifrado)) 	:- random_between(1,4,X),semifrase_no_conclusiva(I,(Acordes,Cifrado),X),!.

	semifrase_no_conclusiva(I,(Acordes,Cifrado),1)	:- cad_plag_III(I,(Acordes,Cifrado)),!.
	semifrase_no_conclusiva(I,(Acordes,Cifrado),2)	:- cad_plag_VI(I,(Acordes,Cifrado)),!.
	semifrase_no_conclusiva(I,(Acordes,Cifrado),3)	:- cad_semicad(I,(Acordes,Cifrado)),!.
	semifrase_no_conclusiva(I,(Acordes,Cifrado),4)	:- cad_rota(I,(Acordes,Cifrado)),!.		
	
% 6.4 Con enfatizaciones a otros tonos
cad_DD(I,([T,SII64,DD43,D6],["T","SII64","D/D43","D6"]))		:- ton_maj(I,T),sub_II_maj(I,SII),inv_64(SII,SII64),dom_dom_sept(I,DD),inv_43(DD,DD43),dom(I,D),inv_6(D,D6),!.
cad_DS(I,([T,III64,DS2,S6],["T","III64","D/S2","S6"]))			:- ton_maj(I,T),ton_III(I,III),inv_64(III,III64),dom_sub_sept(I,DS),inv_2(DS,DS2),sub_IV_maj(I,S),inv_6(S,S6),!.
cad_DS_DD(I,([T,DS,S64,DD,D64],["T","D/S","S64","D/D","D64"])) 	:- ton_maj(I,T),dom_sub_sept(I,DS),sub_IV_maj(I,S),inv_64(S,S64),dom_dom_sept(I,DD),dom(I,D),inv_64(D,D64),!.
cad_rel_min(I,([T,D6,VIIdis,VI6],["T","D6","VIIdis","VI6"]))	:- ton_maj(I,T),dom(I,D),inv_6(D,D6),sept_dis_VII(I,VIIdis),sub_VI_maj(I,VI),inv_6(VI,VI6),!.

	% 6.1.1 Elección aleatoria de frases con enfatizaciones

	semifrase_modulante(I,(Acordes,Cifrado))	:- random_between(1,4,X),semifrase_modulante(I,(Acordes,Cifrado),X),!.
	
	semifrase_modulante(I,(Acordes,Cifrado),1)	:- cad_DD(I,(Acordes,Cifrado)).
	semifrase_modulante(I,(Acordes,Cifrado),2)	:- cad_DS(I,(Acordes,Cifrado)).
	semifrase_modulante(I,(Acordes,Cifrado),3)	:- cad_DS_DD(I,(Acordes,Cifrado)).
	semifrase_modulante(I,(Acordes,Cifrado),4)	:- cad_rel_min(I,(Acordes,Cifrado)).

% 6.5 Retoman la tonalidad comenzando en la subdominante

cad_sub_perf(I,([S64,T,D65,T],["S64","T","D65","T"])) 				:- ton_maj(I,T),sub_IV_maj(I,S),inv_64(S,S64),sept_dom(I,D7),inv_65(D7,D65),!.
cad_sub_647(I,([S64,D64,T,D43,T],["S64","T","D64","D43","T"])) 		:- ton_maj(I,T),sub_IV_maj(I,S),inv_64(S,S64),inv_64(T,D64),sept_dom(I,D7),inv_43(D7,D43),!.
cad_sub_SIIDT(I,([SII,T,D65,T],["SII","T","D65","T"])) 				:- ton_maj(I,T),sub_II_maj(I,SII),sept_dom(I,D7),inv_65(D7,D65),!.
cad_sub_SIISDT(I,([SII,T,S64,D65,T],["SII","T","S64","D65","T"])) 	:- ton_maj(I,T),sub_II_maj(I,SII),sub_IV_maj(I,S),inv_64(S,S64),sept_dom(I,D7),inv_65(D7,D65),!.
cad_sub_SVISDT(I,([SVI6,T,S64,D65,T],["SVI6","T","S64","D65","T"]))	:- ton_maj(I,T),sub_VI_maj(I,SVI),inv_6(SVI,SVI6),sub_IV_maj(I,S),inv_64(S,S64),sept_dom(I,D7),inv_65(D7,D65),!.

	% 6.1.1 Elección aleatoria de frases conclusivas
	
	semifrase_conclusiva_sub(I,(Acordes,Cifrado)) 	:- random_between(1,5,X),semifrase_conclusiva_sub(I,(Acordes,Cifrado),X),!.
	
	semifrase_conclusiva_sub(I,(Acordes,Cifrado),1)	:- cad_sub_perf(I,(Acordes,Cifrado)),!.
	semifrase_conclusiva_sub(I,(Acordes,Cifrado),2)	:- cad_sub_647(I,(Acordes,Cifrado)),!.
	semifrase_conclusiva_sub(I,(Acordes,Cifrado),3)	:- cad_sub_SIIDT(I,(Acordes,Cifrado)),!.
	semifrase_conclusiva_sub(I,(Acordes,Cifrado),4)	:- cad_sub_SIISDT(I,(Acordes,Cifrado)),!.
	semifrase_conclusiva_sub(I,(Acordes,Cifrado),5)	:- cad_sub_SVISDT(I,(Acordes,Cifrado)),!.
	
% 7. Secuencia completa para un modo de coral standard

coral(I,(Acordes,Cifrado))	:- coral_std(I,(Acordes,Cifrado),[1,2,3,4]),!.

coral_std(I,([A|AS],[C|CS]),[1|XS]) :- semifrase_conclusiva(I,(A,C)),coral_std(I,(AS,CS),XS),!.
coral_std(I,([A|AS],[C|CS]),[2|XS]) :- semifrase_no_conclusiva(I,(A,C)),coral_std(I,(AS,CS),XS),!.
coral_std(I,([A|AS],[C|CS]),[3|XS]) :- semifrase_modulante(I,(A,C)),coral_std(I,(AS,CS),XS),!.
coral_std(I,([A],[C]),[4]) 			:- semifrase_conclusiva_sub(I,(A,C)),!.	

`


