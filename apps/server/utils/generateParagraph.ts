const string = "void solve() {	string s; cin>>s;	int n =s.length();	string temp = s;	reverse(temp.begin(), temp.end());	if(s!=temp) {		cout<<0<<endl;		return;	}	int mini = 1;	for(int i=1;i<n;i++){		if(s[i]!=s[0]) {			cout<<1<<endl;		return;		}	}	cout<<n<<endl;}";

export function generateLocalParagraph() {
    return string
}

export async function generateParagraph() {
    try {
        const response = await fetch("http://metaphorpsum.com/paragraphs/2/4");
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = response.text();
        return data;
    } catch (error) {
        console.log(error);
        return generateLocalParagraph();
    }
}