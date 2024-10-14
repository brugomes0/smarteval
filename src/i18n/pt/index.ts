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
	CreateRatingGroups: {
		Description: "Nesta página pode realizar a criação de critérios de avaliação. Cada critério de avaliação é criado com um grupo de opções de classificação que é usado como resposta a questões do tipo Classificação quando associado a uma avaliação/sub-avaliação.",
		Details: "Detalhes",
		RatingGroupDescDesc: "Insira uma descrição para o critério de avaliação",
		RatingGroupDescTitle: "Descrição do critério de avaliação",
		RatingGroupLangDesc: "Selecione os idiomas para os quais este critério de avaliação vai ser criado",
		RatingGroupLangTitle: "Idiomas do critério de avaliação",
		RatingGroupTitleDesc: "Insira um título para identificar o critério de avaliação",
		RatingGroupTitleTitle: "Título do critério de avaliação",
		RatingOptions: "Opções de classificação",
		Title: "Criar critério de avaliação"
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
		Description: "Nesta página são listados todos os grupos de opções de classificação criados e armazenados em base de dados. Estes groupos de opções de classificação servem para o utilizador responder às perguntas com tipo Classificação das avaliações. Pode associar um item desta página com uma sub-avaliação, onde deseja utilizar o critério de avaliação criado.",
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
	SingleRatingGroups: {
		CreateBy: "Criado por utilizador",
		CreateDate: "Data de criação",
		Description: "Descrição",
		NeedComment: "* responder à questão com esta opção obriga o utilizador a adicionar um comentário à resposta",
		RatingOptions: "Opções de classificação",
		RatingOptionsDesc: "Abaixo estão listadas as opções de classificação para resposta às questões de uma avaliação/sub-avaliação ao qual este critério de avaliação está associado. Clique no elemento de seleção para alternar entre os idiomas disponíveis."
	},
	Steps: {
		Finalize: "Finalizar",
		Forward: "Avançar",
		Return: "Voltar",
	}
} satisfies BaseTranslation

export default pt
