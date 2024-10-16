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
		NoCategoriesFilter: "Não foram encotradas categorias que correspondam à sua pesquisa. Tente ajustar as palavras-chave ou limpe o filtro para ver todas as categorias disponíveis para este idioma.",
		Preview: "Pré-Visualizar",
		ShowingItemsLabel: "Exibindo {firstElement} até {pageSize} de {total} items",
		Title: "Categorias e Questões",
		ToastDelete: "Categoria removida com sucesso.",
		ToastDeleteError: "Erro ao remover categoria. Tente de novo."
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
			NoLanguages: "Selecione pelo menos uma linguagem para a qual será criado o critério de avlaiação",
			NoRatingOptions: "Critério de avaliação deve ter pelo menos duas opções de classificação",
			RatingGroupTitle: "Insira um título para o critério de avaliação",
			RatingOptionTitle: "Insira um título para a opção de classificação na posição {position} e idioma {language}"
		}
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
		IsBeingUsedAdd: "Não é possível adicionar uma opção de classificação pois este critério de avaliação ká está a ser usado.",
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
	Header: {
		Home: "Início"
	},
	HomeBackoffice: {
		ActiveReviews: "Avaliações Ativas",
		CompletedReviews: "Avaliações Completas",
		Reviews: "Avaliações",
		Templates: "Modelos"
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
		Home: "Início",
		Performance: "Desempenho",
		Permissions: "Permissões",
		RatingGroups: "Critérios de Avaliação",
		Reviews: "Avaliações",
		Statistics: "Estatísticas",
		Submissions: "Submissões",
		TeamPerformance: "Desempenho Equipa",
		Templates: "Modelos"
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
		NoRatingGroups: "Não existem critérios de avaliação disponíveis de momento. Volte mais tarde ou crie um novo critério de avaliação para começar!",
		NoRatingGroupsFilter: "Não foram encontrados critérios de avaliação que correspondam à sua pesquisa. Tente ajustar as palavras-chave ou limpe o filtro para ver todos os critérios de avaliação disponíveis.",
		Preview: "Pré-Visualizar",
		ShowingItemsLabel: "Exibindo {firstElement} até {pageSize} de {total} items",
		Title: "Critérios de avaliação",
		ToastDelete: "Critério de avaliação removido com sucesso.",
		ToastDeleteError: "Erro ao remover critério de avaliação. Tente de novo."
	},
	Sidebar: {
		Backoffice: "Menu Backoffice",
		Frontoffice: "Menu Frontoffice",
		Hello: "Olá",
		User: "Utilizador"
	},
	SingleCategories: {
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
		CreateBy: "Criado por utilizador",
		CreateDate: "Data de criação",
		Description: "Descrição",
		NeedComment: "* responder à questão com esta opção obriga o utilizador a adicionar um comentário à resposta",
		RatingOptions: "Opções de classificação",
		RatingOptionsDesc: "Abaixo estão listadas as opções de classificação para resposta às questões de uma avaliação/sub-avaliação ao qual este critério de avaliação está associado. Clique no elemento de seleção para alternar entre os idiomas disponíveis."
	},
	Steps: {
		Details: "Detalhes",
		Finalize: "Finalizar",
		Forward: "Avançar",
		RatingOptions: "Opções de classificação",
		RatingQuestions: "Questões de classificação",
		Return: "Voltar",
		TextQuestions: "Questões de texto"
	}
} satisfies BaseTranslation

export default pt
