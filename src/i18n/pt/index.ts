import type { BaseTranslation } from '../i18n-types'

const pt = {
	// TODO: your translations go here
	App: {
		Loading: "A carregar",
		NoLogin: "Sem Login",
		NoLoginDesc: "O utilizador necessita de fazer o login antes de acessar a página.",
		NoUserProfileType: "Utilizador não tem tipo de perfil",
		NoUserProfileTypeDesc: "O utilizador não tem nenhum tipo de perfil associado seja frontoffice ou backoffice. Tente solucionar este problema antes de acessar a página."
	},
	Categories: {
		CreateButton: "Criar categoria",
		Description: "Nesta página são listadas todas as categorias, e as suas respetivas questões, criadas e armazenadas em base de dados. Estas categorias são utilizadas na criação da avaliação/sub-avaliações para criar um formulário ao qual os utilizadores irão responder. Ao criar a avaliação puderá associar a esta as categorias e respetivas questões que desejar.",
		Error: "Erro ao tentar listar as categorias",
		InputText: "Filtar categorias pelo título...",
		Loading: "A carregar...",
		NoCategories: "Não existem categorias disponíveis de momento. Volte mais tarde ou crie uma nova categoria para começar!",
		NoCategoriesFilter: "Não foram encontradas categorias que correspondam à sua pesquisa. Tente ajustar as palavras-chave ou limpe o filtro para ver todas as categorias disponíveis para este idioma.",
		Preview: "Pré-Visualizar",
		ShowingItemsLabel: "Exibindo {firstElement} até {pageSize} de {total} items",
		Title: "Categorias e Questões",
		ToastDelete: "Categoria removida com sucesso.",
		ToastDeleteError: "Erro ao remover categoria. Tente de novo."
	},
	Competencies: {
		ChooseEmployee: "Escolha um funcionário:",
		Description: "Escolha entre as categorias existentes para ver a sua evolução nas diversas avaliações",
		DescriptionBO: "Acompanhe a evolução, entre as diversas avaliações, de um funcionário em cada categoria",
		GoBack: "Voltar",
		InputText: "Filtrar funcionários pelo nome...",
		Next: "Continuar",
		NoEmployeeChoosed: "Não pode continuar sem escolher um funcionário",
		NoCategory: "Não foi escolhida nenhuma categoria",
		ShowingItemsLabel: "Exibindo {firstElement} até {pageSize} de {total} items",
		Title: "Competências"
	},
	CreateCategory: {
		AddQuestion: "Adicionar questão",
		CategoryDescDesc: "Insira uma descrição para a categoria",
		CategoryDescTitle: "Descrição da categoria",
		CategoryTitleDesc: "Insira um título para identificar a categoria.",
		CategoryTitleTitle: "Título da categoria",
		Continue: "Continuar",
		DeleteQuestion: "Remover questão",
		Description: "Nesta página pode realizar a criação de uma nova categoria juntamente com as suas questões. Esta categoria pode ser posteriormente associada a uma avaliação para que o utilizador ao responder à avaliação, responda ás questões da categoria.",
		LanguageDesc: "Selecione para quais idiomas deseja criar a categoria.",
		LanguageTitle: "Selecione o(s) idioma(s)",
		NoTitle: "(Sem título)",
		QuestionDesc: "Descrição da questão",
		QuestionTitle: "Título da questão",
		RatingQuestionsDesc: "Passo para criação de questões de classificação associadas à categoria",
		RatingQuestionsTitle: "Criar questões de classificação",
		ShowInLanguage: "Apresentar na linguagem:",
		TextQuestionsDesc: "Passo para criação de questões de texto associadas à categoria",
		TextQuestionsTitle: "Criar questões de texto",
		Title: "Criar categoria e questões",
		ToastError: "Erro ao criar categoria. Tente de novo",
		ToastSuccess: "Categoria criada com sucesso",
		ValidationError: {
			CategoryTitle: "Insira um título para a categoria em {language}",
			NoLanguages: "Selecione pelo menos uma linguagem para a qual será criada a categoria",
			NoQuestions: "Categoria deve ter pelo menos uma questão",
			QuestionTitle: "Questões devem ter um título em todas as linguagens"
		}
	},
	CreateRatingGroups: {
		AddRatingOption: "Adicionar opção de classificação",
		DeleteRatingOption: "Remover opção de classificação",
		Description: "Nesta página pode realizar a criação de critérios de avaliação. Cada critério de avaliação é criado com um grupo de opções de classificação que é usado como resposta a questões do tipo Classificação quando associado a uma avaliação/sub-avaliação.",
		RatingGroupDescDesc: "Insira uma descrição para o critério de avaliação.",
		RatingGroupDescTitle: "Descrição do critério de avaliação",
		RatingGroupLangDesc: "Selecione os idiomas para os quais este critério de avaliação vai ser criado.",
		RatingGroupLangTitle: "Idiomas do critério de avaliação",
		RatingGroupTitleDesc: "Insira um título para identificar o critério de avaliação.",
		RatingGroupTitleTitle: "Título do critério de avaliação",
		RatingOptionsDesc: "Passo para criação das opções de classificação associadas ao critério de avaliação.",
		RatingOptionsTitle: "Criar opções de classificação",
		ShowInLanguage: "Apresentar na linguagem:",
		SingleRatingOptionDesc: "Descrição da opção de classificação",
		SingleRatingOptionNeedComment: "Necessita de comentário",
		SingleRatingOptionTitle: "Título da opção de classificação",
		Title: "Criar critério de avaliação",
		ToastError: "Erro ao criar o critério de avaliação. Tente de novo",
		ToastSuccess: "Critério de avaliação criado com sucesso",
		ValidationError: {
			NoLanguages: "Selecione pelo menos uma linguagem para a qual será criado o critério de avaliação",
			NoRatingOptions: "Critério de avaliação deve ter pelo menos duas opções de classificação",
			RatingGroupTitle: "Insira um título para o critério de avaliação",
			RatingOptionTitle: "Insira um título para a opção de classificação na posição {position} e idioma {language}"
		}
	},
	CreateReviews: {
		ActivateReview: "Ativar avaliação?",
		ActivateReviewDesc: "Se desejar ativar a avaliação insira um valor para a data de fim da avaliação. Se pretende ativar a avaliação mais tarde deixe em branco.",
		Add: "Adicionar",
		AddEvaluation: "Adicionar sub-avaliação",
		AnswerRating: "Resposta de classificação",
		AnswerText: "Resposta de texto",
		Categories: "Categorias",
		CategoryDivDesc: "Passo para associar categorias, e suas questões, criadas anteriormente, com a sub-avaliação",
		CategoryDivPlaceholder: "Neste momento não existem categorias associadas à sub-avaliação. Duplo-clique na categoria para associá-la à sub-avaliação.",
		CategoryDivTitle: "Associar categorias e questões",
		CategoryPercentage: "Percentagem da categoria",
		Continue: "Continuar",
		CopyEvaluation: "Copiar sub-avaliação",
		CreateEvaluation: "Deseja adicionar esta sub-avaliação à avaliação?",
		CreateEvaluationDesc: "Nesta página pode adicionar e criar a sub-avaliação para esta avaliação. Pode criar a sub-avaliação do zero, clicando no botão de criar ou pode desejar copiar as propriedades de outra sub-avaliação criada nesta avaliação. Se pretende não criar a sub-avaliação basta avançar.",
		DeleteCategory: "Remover categoria",
		DeleteEvaluation: "Remover sub-avaliação",
		Description: "Nesta página pode realizar a criação de uma avaliação. Cada avaliação é criada com um grupo de sub-avaliações. Para cada sub-avaliação deverá especificar o template com as categorias e questões às quais os utilizadores irão responder, e o critério de avaliação a utilizar.",
		EditCategory: "Editar categoria",
		LanguageDesc: "Selecione para quais idiomas deseja criar a categoria.",
		LanguageTitle: "Selecione o(s) idioma(s)",
		Mandatory: "Obrigatório",
		Questions: "Questões",
		QuestionsOfRating: "Questões de classificação",
		QuestionsOfText: "Questões de texto",
		RatingGroupDivDesc: "Passo para associar um critério de avaliação à sub-avaliação",
		RatingGroupDivTitle: "Associar critério de avaliação",
		ReviewDescDesc: "Insira uma descrição para identificar a avaliação.",
		ReviewDescTitle: "Descrição da avaliação",
		ReviewTitleDesc: "Insira um título para identificar a avaliação.",
		ReviewTitleTitle: "Título da avaliação",
		Save: "Guardar",
		SelectEmployees: "Selecione funcionários e departamentos",
		SelectEmployeesText: "Selecione os funcionários e os departamentos que deseja associar à avaliação.",
		ShowInLanguage: "Apresentar na linguagem:",
		Title: "Criar avaliação",
		ToastError: "Erro ao criar avaliação. Tente de novo",
		ToastSuccess: "Avaliação criada com sucesso",
		ValidationError: {
			CategoriesTotalValueNot100: "Combinado da percentagem das categorias da sub-avaliação não são 100%",
			EvaluationType: "Tipo de sub-avaliação não foi encontrado",
			GetCategory: "Ocorreu um erro ao tentar obter a categoria",
			NoCategories: "Não existem categorias na base de dados com os idiomas que deseja",
			NoCategoryQuestion: "As categorias devem ter pelo menos uma questão",
			NoCategoryValue: "Insira um valor válido para a categoria",
			NoDepartments: "Necessita de selecionar departamentos pois foi criada uma sub-avaliação interdepartamental",
			NoEmployees: "Necessita de selecionar funcionários",
			NoEvaluations: "Avaliação não pode ser criada sem pelo menos uma sub-avaliação",
			NoEvaluationTemplate: "Sub-avaliação não pode ser criada sem pelo menos uma categoria e uma questão",
			NoEvaluationValue: "Insira um valor válido para a sub-avaliação",
			NoRatingGroups: "Não existem critérios de avaliação na base de dados com os idiomas que deseja",
			NoSelectionLanguages: "Selecione pelo menos uma linguagem para a qual será criada a avaliação",
			NoSelectionRatingGroup: "Selecione um critério de avaliação para a sub-avaliação",
			NoTitle: "Insira um título para a avaliação",
			RepeatCategory: "A categoria já existe no modelo da sub-avaliação",
		},
		Value: "Valor"
	},
	EditCategories: {
		AddQuestion: "Adicionar questão",
		CategoryDescDesc: "Insira uma descrição para a categoria",
		CategoryDescTitle: "Descrição da categoria",
		CategoryTitleDesc: "Insira um título para identificar a categoria.",
		CategoryTitleTitle: "Título da categoria",
		Continue: "Continuar",
		DeleteQuestion: "Remover questão",
		Description: "Nesta página pode realizar a edição de uma categoria e das suas questões desde que esta não esteja a ser utilizada em avalições",
		LanguageDesc: "Selecione para quais idiomas deseja que a categoria seja apresentada.",
		LanguageTitle: "Selecione o(s) idioma(s)",
		NoTitle: "(Sem título)",
		QuestionDesc: "Descrição da questão",
		QuestionTitle: "Título da questão",
		RatingQuestionsDesc: "Passo para edição de questões de classificação associadas à categoria",
		RatingQuestionsTitle: "Editar questões de classificação",
		ShowInLanguage: "Apresentar na linguagem:",
		TextQuestionsDesc: "Passo para edição de questões de texto associadas à categoria",
		TextQuestionsTitle: "Editar questões de texto",
		Title: "Editar categoria e questões",
		ToastError: "Erro ao editar categoria. Tente de novo",
		ToastSuccess: "Categoria editada com sucesso"
	},
	EditRatingGroups: {
		AddRatingOption: "Adicionar opção de classificação",
		DeleteRatingOption: "Remover opção de classificação",
		Description: "Nesta página pode realizar a edição de um critério de avaliação.",
		IsBeingUsedAdd: "Não é possível adicionar uma opção de classificação pois este critério de avaliação já está a ser usado.",
		IsBeingUsedDelete: "Não é possível remover uma opção de classificação pois este critério de avaliação já está a ser usado.",
		RatingGroupDescDesc: "Insira uma descrição para o critério de avaliação.",
		RatingGroupDescTitle: "Descrição do critério de avaliação",
		RatingGroupLangDesc: "Selecione os idiomas para os quais este critério de avaliação vai ser criado.",
		RatingGroupLangTitle: "Idiomas do critério de avaliação",
		RatingGroupTitleDesc: "Insira um título para identificar o critério de avaliação.",
		RatingGroupTitleTitle: "Título do critério de avaliação",
		RatingOptionsDesc: "Passo para editar as opções de classificação associadas ao critério de avaliação",
		RatingOptionsTitle: "Editar opções de classificação",
		ShowInLanguage: "Apresentar na linguagem:",
		SingleRatingOptionDesc: "Descrição da opção de classificação",
		SingleRatingOptionNeedComment: "Necessita de comentário",
		SingleRatingOptionTitle: "Título da opção de classificação",
		Title: "Editar critério de avaliação",
		ToastError: "Erro ao editar o critério de avaliação. Tente de novo",
		ToastSuccess: "Critério de avaliação editado com sucesso"
	},
	EditReviews: {
		ActivateReview: "Ativar avaliação?",
		ActivateReviewDesc: "Se desejar ativar a avaliação insira um valor para a data de fim da avaliação. Se pretende ativar a avaliação mais tarde deixe em branco.",
		AddEvaluation: "Adicionar sub-avaliação",
		AnswerRating: "Resposta de classificação",
		AnswerText: "Resposta de texto",
		CannotGetCategory: "Erro ao tentar obter a categoria",
		Categories: "Categorias",
		CategoryAlreadyExists: "Categoria já existe na sub-avaliação",
		CategoryDivDesc: "Passo para associar categorias, e suas questões com a sub-avaliação.",
		CategoryDivPlaceholder: "Neste momento não existem categorias associadas à sub-avaliação. Duplo-clique na categoria para associá-la à sub-avaliação.",
		CategoryDivTitle: "Associar categorias e questões",
		Continue: "Continuar",
		CopyEvaluation: "Copiar sub-avaliação",
		CreateEvaluation: "Deseja adicionar esta sub-avaliação à avaliação?",
		CreateEvaluationDesc: "Nesta página pode alterar a sub-avaliação. Criar a sub-avaliação na avaliação ou se esta já estiver criada pode editar. Se desejar continuar basta avançar.",
		DeleteCategory: "Remover categoria",
		DeleteEvaluation: "Remover sub-avaliação",
		Description: "Nesta página pode realizar a edição de uma avaliação.",
		EditCategory: "Editar categoria",
		LanguageDesc: "Selecione para quais idiomas deseja criar a categoria.",
		LanguageTitle: "Selecione o(s) idioma(s)",
		NoCategories: "Não existem categorias na base de dados com os idiomas que deseja",
		NoEvaluation: "Avaliação não encontrada",
		NoRatingGroups: "Não existem critérios de avaliação na base de dados com os idiomas que deseja",
		NoSelectionLanguages: "Selecione pelo menos uma linguagem para a qual será criada a avaliação",
		ReviewDescDesc: "Edite a descrição para identificar a avaliação.",
		ReviewDescTitle: "Descrição da avaliação",
		ReviewTitleDesc: "Edite o título para identificar a avaliação.",
		ReviewTitleTitle: "Título da avaliação",
		ShowInLanguage: "Apresentar na linguagem:",
		Title: "Editar avaliação"
	},
	EmployeesComponent: {
		NoEmployees: "Sem funcionários para mostrar",
		SelectAll: "Selecionar todos"
	},
	EmployeesDepartments: {
		ChooseEvaluated: "Escolha o funcionário que irá ser o avaliado nesta submissão",
		ChooseEvaluatedDep: "Escolha o departamento que irá ser avaliado nesta submissão",
		ChooseEvaluator: "Escolha o funcionário que irá ser o avaliador nesta submissão",
		ChooseEvaluatorDep: "Escolha o departamento que irá avaliar nesta submissão",
		ChooseSupervisor: "Escolha a chefia que irá avaliar nesta submissão",
		GoBack: "Voltar",
		Next: "Avançar",
		Save: "Guardar",
		ShowingItemsLabel: "Exibindo {firstElement} até {pageSize} de {total} items",
		ToastCreate: "Nova submissão criada com sucesso",
		ToastCreateError: "Erro ao tentar criar uma nova submissão. Tente de novo."
	},
	EvaluationTypes: {
		BottomUp: "BottomUp",
		Departmental: "Equipa",
		Interdepartmental: "Interdepartamental",
		SelfEvaluation: "Auto-avaliação",
		TopDown: "TopDown"
	},
	Excel: {
		Average: "Média",
		Compilation: "Compilação",
		Scale: "Escala",
		Total: "Total"
	},
	Header: {
		Home: "Início"
	},
	HomeBackoffice: {
		ActiveReviews: "Avaliações Ativas",
		Back: "Anterior",
		Categories: "Categorias",
		CompletedReviews: "Avaliações Completas",
		Create: "Criar",
		CreateCategory: "Criar categoria",
		CreateRatingGroup: "Criar critério de avaliação",
		CreateReview: "Criar avaliação",
		EndDate: "Data de fim",
		ErrorActions: "Não foi possível apresentar as últimas ações. Tente de novo.",
		ErrorActiveReviewsList: "Não foi possível apresentar as avaliação ativas. Tente de novo.",
		ErrorCountReviewsEachStatus: "Não foi possível apresentar o gráfico. Tente mais tarde.",
		LastActions: "Últimas ações",
		Loading: "A carregar...",
		Next: "Próxima",
		NoActions: "Sem ações para apresentar.",
		NoActiveReviews: "Sem avaliações ativas neste momento.",
		RatingGroups: "Critérios de avaliação",
		Review: "Avaliação",
		Reviews: "Avaliações",
		ShortCuts: "Atalhos de criação",
		Templates: "Modelos"
	},
	HomeFrontoffice: {
		AvgRatingBottomUp: "Valor da última avaliação (BottomUp)",
		AvgRatingTopDown: "Valor da última avaliação (TopDown)",
		Dashboard: "Dashboard",
		NoSubmissions: "Não tem nenhuma submissão para realizar",
		Percentile: "Percentagem",
		SeeAllCompetencies: "ver página de competências",
		SeeAllSubmissions: "ver página de submissões",
		TaskList: "Lista de tarefas"
	},
	Languages: {
		EN: "Inglês",
		ES: "Espanhol",
		FR: "Francês",
		PL: "Polaco",
		PT: "Português"
	},
	Menu: {
		Categories: "Categorias",
		Competencies: "Competências",
		Home: "Início",
		Performance: "Desempenho",
		Permissions: "Permissões",
		RatingGroups: "Critérios de Avaliação",
		Reviews: "Avaliações",
		Statistics: "Estatísticas",
		Submissions: "Submissões",
		Team: "Equipa",
		TeamCompetency: "Competências da Equipa",
		TeamPerformance: "Desempenho da Equipa",
		Templates: "Modelos"
	},
	ModalEditCategory: {
		CategoryPercentageValueRequired: "Categoria necessita de um valor válido para a sua percentagem na avaliação",
		RequiredQuestionsNeedPercentage: "Questões obrigatórias devem ter um valor para percentagem na categoria",
		SumQuestionsPercentage: "Soma das percentagens das questões obrigatórias deve ser 100%"
	},
	Performance: {
		AverageCategory: "Média da Categoria",
		CompareOtherReview: "Comparar com outra revisão",
		Description: "Nesta página pode consultar o seu desempenho nas diversas avaliações.",
		MyPerformance: "O meu desempenho",
		Next: "Continuar",
		NoReviews: "No momento, não existem avaliações sobre si. Tente mais tarde.",
		Scale: "Escala",
		SubmissionDetails: "Detalhes Por Submissão",
		Title: "Desempenho",
		ToastSelectReviewError: "Para avançar necessita de selecionar uma avaliação",
		Total: "Total"
	},
	Permissions: {
		ChooseProfile: "Selecionar perfil",
		ChooseProfileDesc: "Selecione o perfil ao qual deseja alterar as permissões",
		Loading: "A carregar",
		PermissionType: {
			Create: "Criar",
			Delete: "Remover",
			Patch: "Alterar estado",
			Read: "Acessar",
			Update: "Editar"
		},
		PermissionsSave: "Permissões do perfil guardadas com sucesso",
		PermissionsSaveError: "Ocorreu um erro ao tentar gravar as permissões do perfil",
		Save: "Guardar"
	},
	RatingGroups: {
		CreateButton: "Criar critério de avaliação",
		Description: "Nesta página são listados todos os grupos de opções de classificação criados e armazenados em base de dados. Estes grupos de opções de classificação servem para o utilizador responder às perguntas com tipo Classificação das avaliações. Pode associar um item desta página com uma sub-avaliação, onde deseja utilizar o critério de avaliação criado.",
		Error: "Erro ao tentar listar os critérios de avaliação",
		InputText: "Filtrar critérios de avaliação pelo título...",
		Loading: "A carregar...",
		NoDescription: "Sem descrição",
		NoRatingGroups: "Não existem critérios de avaliação disponíveis de momento. Volte mais tarde ou crie um novo critério de avaliação para começar!",
		NoRatingGroupsFilter: "Não foram encontrados critérios de avaliação que correspondam à sua pesquisa. Tente ajustar as palavras-chave ou limpe o filtro para ver todos os critérios de avaliação disponíveis.",
		Preview: "Pré-Visualizar",
		ShowingItemsLabel: "Exibindo {firstElement} até {pageSize} de {total} items",
		Title: "Critérios de avaliação",
		ToastDelete: "Critério de avaliação removido com sucesso.",
		ToastDeleteError: "Erro ao remover critério de avaliação. Tente de novo."
	},
	Reviews: {
		CreateButton: "Criar avaliação",
		Description: "Nesta página são listadas todas as avaliações criadas até ao momento dividas pelo seu estado atual. Para ver avaliações em outros estados terá que clicar no estado que deseja para essa finalidade. Caso tenha permissão para tal, puderá criar e remover uma avaliação clicando nos respetivos botões para esse efeito.",
		Error: "Erro ao tentar listar as avaliações",
		InputText: "Filtrar avaliações pelo título...",
		Loading: "A carregar...",
		NeedAuths: "Para criar uma avaliação, são necessarias permissões para acessar categorias e critérios de avaliação. Após receber essas permissões tente de novo.",
		NoReviews: "Não existem avaliações com este estado disponíveis neste momento. Volte mais tarde ou crie uma nova avaliação para começar!",
		NoReviewsFilter: "Não foram encontradas avaliações que correspondam à sua pesquisa. Tente alterar o estado ou limpe o filtro para ver possíveis avaliações disponíveis.",
		Preview: "Pré-Visualizar",
		ShowingItemsLabel: "Exibindo {firstElement: number} até {pageSize: number} de {total: number} items",
		Title: "Avaliações",
		ToastDelete: "Avaliação removida com sucesso.",
		ToastDeleteError: "Erro ao remover avaliação. Tente de novo."
	},
	ReviewStatus: {
		Active: "Ativas",
		Canceled: "Canceladas",
		Completed: "Completas",
		NotStarted: "Não iniciadas",
		NumberReviews: "Nº de Avaliações",
		SingleActive: "Ativa",
		SingleCanceled: "Cancelada",
		SingleCompleted: "Completa",
		SingleNotStarted: "Não iniciada"
	},
	Sidebar: {
		Backoffice: "Menu Backoffice",
		Frontoffice: "Menu Frontoffice",
		Hello: "Olá",
		User: "Utilizador"
	},
	SingleCategories: {
		ActionsDelete: "Remover categoria",
		ActionsDeleteModal: "Tem a certeza que pretende remover a categoria? Esta ação não pode ser revertida.",
		CreateBy: "Criado por utilizador",
		CreateDate: "Data de criação",
		Description: "Descrição",
		Option: "Opção",
		Questions: "Questões",
		QuestionsTitle: "Abaixo estão listadas as questões da categoria.",
		TextResponse: "Resposta de texto",
		Type: "Tipo de questão"
	},
	SingleRatingGroups: {
		ActionsDelete: "Remover critério de avaliação",
		ActionsDeleteModal: "Tem a certeza que pretende remover o critério de avaliação? Esta ação não pode ser revertida.",
		CreateBy: "Criado por utilizador",
		CreateDate: "Data de criação",
		Description: "Descrição",
		NeedComment: "* responder à questão com esta opção obriga o utilizador a adicionar um comentário à resposta",
		RatingOptions: "Opções de classificação",
		RatingOptionsDesc: "Abaixo estão listadas as opções de classificação para resposta às questões de uma avaliação/sub-avaliação ao qual este critério de avaliação está associado. Clique no elemento de seleção para alternar entre os idiomas disponíveis."
	},
	SingleReview: {
		ActionsLabel: "Ações",
		ActionsActivate: "Ativar avaliação",
		ActionsActivateButton: "Ativar",
		ActionsActivateDesc: "Ao alterar o estado da avaliação para ativa, as pessoas associadas à avaliação puderão iniciar a resposta às questões presentes em cada sub-avaliação desta avaliação.",
		ActionsActivateModal: "Tem a certeza que pretende ativar a avaliação? Para isso, terá de especificar uma data de fim para a avaliação, limite até ao qual as pessoas puderão enviar as respostas ao formulário.",
		ActionsCancel: "Cancelar avaliação",
		ActionsCancelButton: "Cancelar",
		ActionsCancelDesc: "Cancelar a avaliação. O estado da avaliação passará a Cancelada impossibilitando as pessoas associadas á avaliação de puder responder ao questionário.",
		ActionsCancelModal: "Tem a certeza que pretende cancelar a avaliação?",
		ActionsComplete: "Finalizar avaliação",
		ActionsCompleteButton: "Finalizar",
		ActionsCompleteDesc: "Tem a certeza que pretende completar a avaliação. A avaliação passará para o estado Completa impossibilitando pessoas pendentes de responder ao questionário de o fazer.",
		ActionsCompleteModal: "Tem a certeza que pretende finalizar a avaliação?",
		ActionsDelete: "Remover Avaliação",
		ActionsDeleteButton: "Remover",
		ActionsDeleteDesc: "Uma vez removida a avaliação, não poderá voltar atrás. Por favor tenha a certeza que é isto que deseja fazer.",
		ActionsDeleteModal: "Tem a certeza que pretende remover a avaliação? Esta ação não pode ser revertida.",
		ActionsEdit: "Editar avaliação",
		ActionsEditButton: "Editar",
		ActionsEditDesc: "Faça as alterações que achar necessárias à avaliação.",
		ActionsEditModal: "Tem a certeza que pretende editar a revisão?",
		ActionsExtend: "Extender data final da avaliação",
		ActionsExtendButton: "Extender",
		ActionsExtendDesc: "Ao extender a data final da avaliação, permite às pessoas associadas à avaliação de puderem responder ao questionário.",
		ActionsExtendModal: "Tem a certeza que pretende extender a data de fim da avaliação, dando assim oportunidade para as pessoas associadas à avaliação, que não responderam ao formulário que o façam? Para isso terá de especificar uma nova data para o fim da avaliação.",
		Confirm: "Confirmar",
		CreateBy: "Criada por",
		DateCreate: "Criada a",
		DateEnd: "Finalizada a",
		DateStart: "Iniciada a",
		Description: "Descrição da avaliação",
		ErrorGetEvaluation: "Erro ao tentar buscar a sub-avaliação. Tente de novo.",
		ErrorQuestionType: "Erro, Tipo da questão não existe.",
		FormEvaluation: "Formulário da sub-avaliação",
		Loading: "A carregar...",
		NoActionsAvailable: "Não existem ações disponíveis.",
		NoDescription: "Sem descrição...",
		Progress: "Progresso",
		ProgressComplete: "Submissões Completas",
		ProgressTotal: "Submissões Totais",
		ShowInLanguage: "Apresentar no idioma: ",
		Status: "Estado da avaliação",
		Submissions: "Submissões",
		ToastChangeStatus: "Estado da avaliação alterado com successo.",
		ToastChangeStatusError: "Não foi possível alterar o estado da avaliação."
	},
	SingleSubmission: {
		EndDate: "Submeter até",
		EvaluatedDepartment: "Departamento a avaliar",
		EvaluatedEmployee: "Funcionário a avaliar",
		EvaluationType: "Sub-avaliação",
		InfoSubmission: "Informação da submissão",
		Required: "Obrigatório",
		ReviewName: "Nome da avaliação",
		SubmissionForm: "Formulário",
		Submit: "Submeter",
		ToastNeedCommentError: "Questões com a caixa de comentário visível, necessitam de ser preenchidas",
		ToastSubmission: "Resposta enviada com sucesso",
		ToastSubmissionError: "Erro ao tentar enviar a submissão."
	},
	Statistics: {
		Average: "Média da avaliação",
		AverageByEmployee: "Média por funcionário",
		ChooseDepartment: "Escolha o departamento",
		ChooseDepartmentDesc: "Abaixo estão listados os departamentos avaliados na avaliação. Escolha entre as opções para ver a avaliação em cada sub-avaliação.",
		ChooseEmployee: "Escolha o funcionário",
		ChooseEmployeeDesc: "Abaixo estão listados os funcionários avaliados na avaliação. Escolha entre as opções para ver a avaliação em cada sub-avaliação.",
		Description: "Consulte dados e tendências das avaliações dos funcionários. Analise feedback, acompanhe o desempenho e observe a evolução dos funcionários ao longo do tempo. Apenas necessita de selecionar uma das avaliações já completas listadas abaixo, caso já exista alguma avalição completa.",
		Details: "Detalhes da avaliação",
		ExcelFiles: "Mapa de sub-avaliação",
		Interdepartamental: "Sub-avaliação interdepartamental",
		Next: "Continuar",
		NoReviews: "No momento, não existem avaliações completas. Tente mais tarde.",
		Scale: "Escala",
		ShowingItemsLabel: "Exibindo {firstElement: number} até {lastElement: number} de {total: number} items",
		Title: "Estatísticas",
		ToastSelectReviewError: "Para avançar necessita de escolher uma avaliação",
		Total: "Total"
	},
	Steps: {
		Details: "Detalhes",
		Employees: "Funcionários",
		Finalize: "Finalizar",
		Forward: "Avançar",
		RatingOptions: "Opções de classificação",
		RatingQuestions: "Questões de classificação",
		Return: "Voltar",
		TextQuestions: "Questões de texto"
	},
	SubmissionModal: {
		ChooseDepartment: "Escolha um departamento",
		ChooseEmployee: "Escolha um funcionário",
		CreateSubmission: "Criar submissão",
		Date: "Data",
		Description: "Tem a certeza que pretende remover a submissão? Este passo é irreversível.",
		Error: "Erro ao tentar retornar as submissões",
		Evaluated: "Avaliado",
		EvaluatedDep: "Departamento Avaliado",
		Evaluator: "Avaliador",
		EvaluatorDep: "Departamento Avaliador",
		Loading: "A carregar...",
		NoSubmissions: "Sem submissões para mostrar",
		Remove: "Remover",
		Search: "Procurar",
		SelectAll: "Todas",
		SelectNo: "Apenas não submetidas",
		SelectYes: "Apenas submetidas",
		ShowingItemsLabel: "Exibindo {firstElement: number} até {pageSize: number} de {total: number} items",
		Submitted: "Submetido",
		Title: "Remover submissão",
		ToastCreate: "Nova submissão criada com sucesso",
		ToastCreateError: "Ocorreu um erro ao tentar criar uma submissão. Tente de novo.",
		ToastDelete: "Submissão removida com sucesso",
		ToastDeleteError: "Ocorreu um erro ao tentar remover a submissão. Tente de novo."
	},
	Submissions: {
		AlterSubmissionDesc: "Tem a certeza que pretende alterar a submissão?",
		AlterSubmissionTitle: "Alterar submissão",
		Description: "Nesta secção, encontra uma visão geral de todas as avaliações, sub-avaliações e submissões que precisa de realizar. Pode consultar avaliações ativas, onde existe a sua participação para responder ao questionário e aceder ao histórico de submissões que realizou. Mantenha-se atualizado com os prazos e assegure-se que realiza as suas submissões dentro do prazo.",
		Loading: "A carregar...",
		NoReviews: "No momento, não existem submissões para mostrar.",
		TabActive: "Ativas",
		TabHistory: "Histórico",
		Title: "Submissões",
		ValidationEvaluatedDepartmentError: "Submissão necessita de um departamento sobre o qual será feita a avaliação",
		ValidationEvaluatorDepartmentError: "Submissão necessita de um departamento ao qual pertence o funcionário que realizará esta submissão",
		ValidationEvaluatedEmployeeError: "Submissão necessita de um funcionário sobre o qual será feita a avaliação",
		ValidationEvaluatorEmployeeError: "Submissão necessita de um funcionário que a realize",
	},
	Team: {
		Continue: "Continuar",
		Description: "Página da sua equipa. Escolha entre as opções, a que deseja visualizar sobre os seus funcionários",
		TeamCompetencyDesc: "Nesta página pode consultar as categorias existentes para ver a evolução do seu funcionário nas diversas avaliações.",
		TeamPerformanceDesc: "Nesta página pode consultar o desempenho dos seus funcionários nas diversas avaliações.",
		Title: "Equipa"
	},
	TeamCompetency: {
		Description: "Escolha entre as categorias existentes para ver a evolução do seu funcionário nas diversas avaliações.",
		Title: "Competências"
	},
	TeamPerformance: {
		ChooseEmployeeTitle: "Selecione um funcionário",
		ChooseEmployeeDesc: "Selecione um funcionário para mostrar a avaliação.",
		Description: "Nesta página pode consultar o desempenho dos seus funcionários nas diversas avaliações.",
		EmployeePerformance: "Desempenho funcionário",
		Next: "Continuar",
		NoReviews: "No momento, não existem avaliações sobre si. Tente mais tarde.",
		ShowingItemsLabel: "Exibindo {firstElement: number} até {pageSize: number} de {total: number} items",
		SubmissionDetails: "Detalhes por submissão",
		Title: "Desempenho da Equipa",
		ToastSelectReviewError: "Para avançar necessita de selecionar uma avaliação",
		Total: "Total"
	}
} satisfies BaseTranslation

export default pt
