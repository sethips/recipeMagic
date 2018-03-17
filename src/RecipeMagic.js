import React, {Component} from "react";
import RecipeListElement from "./RecipeListElement";
import RecipeDetails from "./RecipeDetails";
import axios from "axios";

class RecipeMagic extends Component {

    constructor(props) {
        super(props);

        this.searchTimeout = null;
        this.searchTimeoutValue = 500;
        this.apiKey = "00e87db25f69ecd8de56fbc93c280bf";

        this.state = {
            searchValue: "",
            recipesList: [],
            recipe: {},
            recipeLoaded: false,
        };

        this.searchRecipes = this.searchRecipes.bind(this);
        this.getRecipeData = this.getRecipeData.bind(this);
        this.handleRequest = this.handleRequest.bind(this);
        this.handleRecipeData = this.handleRecipeData.bind(this);
        this.updateSearchValue = this.updateSearchValue.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    updateSearchValue(event) {
        this.setState({searchValue: encodeURI(event.target.value)});
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(this.searchRecipes, this.searchTimeoutValue);
    }

    handleRequest(response) {
        this.setState({recipesList: response.data.recipes});
        console.log(response);
    }

    handleRecipeData(response) {
        console.log(response);
        this.setState({recipe: response.data.recipe});
        this.setState({recipeLoaded: true});
    }

    searchRecipes() {
        axios.get("http://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?key="+this.apiKey+"8&q="+this.state.searchValue).then(this.handleRequest);
    }

    getRecipeData(id) {
        axios.get(`http://cors-anywhere.herokuapp.com/http://food2fork.com/api/get?key=${this.apiKey}8&rId=${id}`).then(this.handleRecipeData);
    }

    handleClose() {
        this.setState({recipeLoaded: false});
    }


    render() {
        let utilRecipeContainer = this.state.recipeLoaded ?
            <RecipeDetails handleClose={this.handleClose} recipe={this.state.recipe} />
            : "";
        return (
            <div>
                <label>What do you have in your fridge?</label>
                <div>
                    <input onChange = {this.updateSearchValue} id="recipeSearch" type="text"/>
                </div>
                {utilRecipeContainer}
                <ul>
                    {this.state.recipesList.map((recipe) =>

                        <RecipeListElement key={recipe.recipe_id} recipe={recipe} getDetails={() => this.getRecipeData(recipe.recipe_id)} />
                    )}
                </ul>
            </div>
        )
    }
}

export default RecipeMagic;