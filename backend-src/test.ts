import { UserService } from './services/UserService';
import { StoryworldService } from './services/StoryworldService';
import { WorldbuildingService } from './services/WorldbuildingService';
import { SocialService } from './services/SocialService';
import { CircleService } from './services/CircleService';

async function test() {
  console.log("Testing Technical Foundation...");

  try {
    const ts = Date.now();
    // 1. Test Storyworld Limit for Draftsman
    console.log("\n--- Testing Storyworld Limits ---");
    console.log("Creating first storyworld for user_test_1 (Draftsman)...");
    StoryworldService.createStoryworld('user_test_1', `sw_1_${ts}`, 'My First World', 'A test world');
    console.log("Success.");

    try {
      console.log("Attempting to create second storyworld for user_test_1 (Draftsman)...");
      StoryworldService.createStoryworld('user_test_1', `sw_2_${ts}`, 'My Second World', 'Should fail');
    } catch (e: any) {
      console.log("Caught expected error:", e.message);
    }

    console.log("Creating multiple storyworlds for user_test_2 (Architect)...");
    StoryworldService.createStoryworld('user_test_2', `sw_3_${ts}`, 'Architect World 1');
    StoryworldService.createStoryworld('user_test_2', `sw_4_${ts}`, 'Architect World 2');
    console.log("Success.");

    // 2. Test Feature Gating
    console.log("\n--- Testing Feature Gating ---");
    console.log("Draftsman attempting to create a Secret...");
    try {
      WorldbuildingService.createSecret('user_test_1', `sw_1_${ts}`, `secret_1_${ts}`, 'The Dark Truth', 'Everyone is a robot');
    } catch (e: any) {
      console.log("Caught expected error:", e.message);
    }

    console.log("Architect creating a Secret...");
    WorldbuildingService.createSecret('user_test_2', `sw_3_${ts}`, `secret_2_${ts}`, 'The Real Truth', 'The cake is a lie');
    console.log("Success.");

    console.log("Architect creating a Timeline...");
    WorldbuildingService.createTimeline('user_test_2', `sw_3_${ts}`, `tl_1_${ts}`, 'History of Ink', [{ year: 1800, event: 'First blot' }]);
    console.log("Success.");

    console.log("Architect creating a Secret Society...");
    WorldbuildingService.createSecretSociety('user_test_2', `sw_3_${ts}`, `ss_1_${ts}`, 'The Midnight Bloters', 'Hidden in the shadows');
    console.log("Success.");

    // 3. Test Aesthetic Customization
    console.log("\n--- Testing Aesthetic Customization ---");
    console.log("Architect attempting to customize (Should fail)...");
    try {
      UserService.updateCustomization('user_test_2', { theme: 'dark', font: 'Cursive' });
    } catch (e: any) {
      console.log("Caught expected error:", e.message);
    }

    console.log("Collective user customizing...");
    UserService.updateCustomization('user_test_3', { theme: 'literary-noir', font: 'Typewriter' });
    console.log("Success.");

    // 4. Test Writer Circles
    console.log("\n--- Testing Writer Circles ---");
    console.log("Collective user creating a Circle...");
    CircleService.createCircle('user_test_3', `circle_1_${ts}`, 'The Ink-Stained Poets', 'A circle for the elite bloters.');
    console.log("Success.");

    console.log("Architect user joining Circle...");
    CircleService.joinCircle('user_test_2', `circle_1_${ts}`);
    console.log("Success.");

    console.log("Draftsman attempting to join Circle (Should fail)...");
    try {
      CircleService.joinCircle('user_test_1', `circle_1_${ts}`);
    } catch (e: any) {
      console.log("Caught expected error:", e.message);
    }

    console.log("Architect attempting to create a Circle (Should fail)...");
    try {
      CircleService.createCircle('user_test_2', `circle_2_${ts}`, 'Failed Circle');
    } catch (e: any) {
      console.log("Caught expected error:", e.message);
    }

    // 5. Test Social Loop
    console.log("\n--- Testing Social Loop ---");
    console.log("Draftsman posting a vignette...");
    SocialService.createPost('user_test_1', `post_1_${ts}`, 'The ink blotted on the page...', `sw_1_${ts}`);
    
    console.log("Architect sending an Ask to Draftsman...");
    SocialService.createAsk('user_test_2', 'user_test_1', `ask_1_${ts}`, 'How do you blott so well?');
    
    console.log("Draftsman answering Ask publicly...");
    SocialService.answerAsk(`ask_1_${ts}`, 'Years of practice.', true);

    console.log("Retrieving feed...");
    const feed = SocialService.getFeed();
    console.log("Feed items count:", feed.length);

    console.log("\nTesting Complete.");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();
